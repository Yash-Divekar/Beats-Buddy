from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('', views.index , name='index'),
    path('register' , views.register , name='register'),
    path('login' , views.login_user , name='login'),
    path('logout' , views.log_out , name='logout'),
    path('like', views.like , name='like'),
    path('recent' , views.recent , name='recent'),
    path('addtoPlaylist/<int:index>' , views.addtoPlylist ,name='addtoPlaylist')
]