from django.shortcuts import render , redirect
from django.http import JsonResponse

def index(request):
    return render(request , 'search.html')
    
