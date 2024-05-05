from django.shortcuts import render , redirect
from django.http import JsonResponse
from .forms import User_Form , User_Data_Form
from django.contrib.auth import authenticate , login , logout
from django.contrib.auth.decorators import login_required
from .models import *
import json
from django.contrib.auth.hashers import make_password
from django.utils import timezone

def register(request):
    if request.method == 'POST':
        user_form = User_Form(request.POST)
        user_data_form = User_Data_Form(request.POST)
        if user_form.is_valid() and user_data_form.is_valid() and request.POST['password']==request.POST['pwd']:
            password = make_password(request.POST['password'])
            user_form.cleaned_data['password'] = password
            
            user = user_form.save()  # Save the User instance first
            user_data = user_data_form.save(commit=False)  # Get the unsaved instance of UserData
            user_data.user = user  # Assign the current user to the user field
            user_data.save() 
            return redirect('index')  # Redirect to a success page
    else:
        user_form = User_Form()
        user_data_form = User_Data_Form()
    return render(request, 'register.html', {'user_form': user_form , "user_data_form" : user_data_form})

def login_user(request):
    if request.method =="POST":
        user = authenticate(username = request.POST["username"] , password = request.POST["pwd"])
        if user is not None:
            login(request , user)
            return redirect('index')
        else:
            return render(request , 'login.html' , status=400)
    return render(request , "login.html")

@login_required(redirect_field_name='login_user')
def log_out(request):
    logout(request)
    return redirect('login')
    
@login_required(redirect_field_name='login_user')
def index(request):
    data={}
    liked = LikedSongs.objects.filter(user = request.user)
    like=[]
    for i in liked:
        like.append({'song_id':i.song_id , 'name' : i.name , 'artist':i.artist , 'img':i.img , 'link':i.link , 'duration' : i.duration})
    
    recent_played= Recent_played.objects.filter(user = request.user).order_by('-time')
    recent=[]
    for i in recent_played:
        recent.append({'song_id':i.song_id , 'name' : i.name , 'artist':i.artist , 'img':i.img , 'link':i.link , 'duration':i.duration})
        
    playlists = Playlist.objects.filter(user = request.user)
    y=[]
    for i in playlists:
        songs = PlaylistSongs.objects.filter(playlist = i)
        x=[]
        for j in songs:
            x.append({'song_id':j.song_id , 'name' : j.name , 'artist':j.artist , 'img':j.img , 'link':j.link , 'duration' : j.duration})
            
        y.append({'name':i.name , 'songs':x})
    y1 = [(index, item) for index, item in enumerate(y)]
    
    data.update({'user':request.user.username,'liked':like , 'playlist':y1 , 'recent':recent})
    
    return render(request , 'index.html' , context={'data':data})
    
@login_required(redirect_field_name='login_user')
def like(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        data = data.get('data')
        x = LikedSongs(user= request.user , song_id =data.get('song_id') , name = data.get('name') , artist = data.get('artist') , img = data.get('img') ,link = data.get('link') , duration=data.get('duration'))
        x.save()
        print("success")
        return JsonResponse({'message': 'Data received successfully'})
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)
    
@login_required(redirect_field_name='login_user')
def recent(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        data = data.get('data')
        song_id = data.get('song_id')
        existing_entry = Recent_played.objects.filter(user=request.user, song_id=song_id).first()
        
        if existing_entry:
            existing_entry.time = timezone.now()
            existing_entry.save()
            print("update")
            return JsonResponse({'message': 'Data time updated successfully'})
        else:
            x = Recent_played(user=request.user, song_id=song_id, name=data.get('name'), artist=data.get('artist'), img=data.get('img'), link=data.get('link') , duration=data.get('duration'))
            x.save()
            print("added")
            return JsonResponse({'message': 'New data added successfully'})
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)
    
@login_required(redirect_field_name='login_user')
def addtoPlylist(request , index):
    if request.method == 'POST':
        data = json.loads(request.body)
        data = data.get('data')
        x = PlaylistSongs(playlist=Playlist.objects.filter(user = request.user)[index] , song_id = data.get('song_id') , name = data.get('name') , artist = data.get('artist') , img = data.get('img') ,link = data.get('link') , duration=data.get('duration'))
        x.save()
        print("success")
        return JsonResponse({'message': 'Data received successfully'})
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)