from django.shortcuts import render , redirect
from django.http import JsonResponse
from .forms import User_Form , User_Data_Form
from django.contrib.auth import authenticate , login , logout
from django.contrib.auth.decorators import login_required
from .models import *
import json
from django.contrib.auth.hashers import make_password


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
        like.append({'song_id':i.song_id , 'name' : i.name , 'artist':i.artist , 'img':i.img , 'link':i.link})
    
    playlists = Playlist.objects.filter(user = request.user)
    y=[]
    for i in playlists:
        songs = PlaylistSongs.objects.filter(playlist = i)
        x=[]
        for j in songs:
            x.append({'song_id':i.song_id , 'name' : i.name , 'artist':i.artist , 'img':i.img , 'link':i.link})
            
        y.append({'name':i , 'songs':x})
    
    data.update({'user':request.user,'liked':like , 'playlist':y})
    
    print(data)
    return render(request , 'search.html' , context={'data':data})
    
@login_required(redirect_field_name='login_user')
def like(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        data = data.get('data')
        x = LikedSongs(user= request.user , song_id =data.get('song_id') , name = data.get('name') , artist = data.get('artist') , img = data.get('img') ,link = data.get('link'))
        x.save()
        print("success")
        return JsonResponse({'message': 'Data received successfully'})
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)
    
