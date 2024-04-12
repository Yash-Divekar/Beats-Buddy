from django.shortcuts import render , redirect
from django.http import JsonResponse
from .forms import User_Form

def register(request):
    print("hi")
    if request.method == 'POST':
        form = User_Form(request.POST)
        if form.is_valid():
            form.save()
            return redirect('login')  # Redirect to a success page
    else:
        form = User_Form()
    return render(request, 'index.html', {'form': form})

def login(request):
    pass

def index(request):
    return render(request , 'search.html')
    
