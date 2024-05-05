from django.db import models
from django_countries.fields import CountryField
from django.contrib.auth.models import User

GENDERS = (
    ("Male", 'Male'),
    ("Female", "Female"),
    ("Null", "Prefer Not to Say")
)

class UserData(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True )
    name = models.CharField(max_length=50, unique=True)
    gender = models.CharField(choices=GENDERS, default="Null", max_length=200)
    age = models.IntegerField()
    nationality = CountryField()
    
    def __str__(self):
        return self.name

class LikedSongs(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='liked_songs')
    song_id = models.CharField( max_length=200)
    name = models.CharField(max_length=200)
    artist = models.CharField(max_length=200)
    img = models.URLField()
    link = models.URLField()
    duration = models.TextField()
    time = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f'{self.name}'

class Playlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='playlists')
    name = models.CharField(max_length=200)
    
    def __str__(self):
        return f'{self.name}'

class PlaylistSongs(models.Model):
    playlist = models.ForeignKey(Playlist, on_delete=models.CASCADE, related_name='songs')
    song_id = models.CharField(max_length=200)
    name = models.CharField(max_length=200)
    artist = models.CharField(max_length=200)
    img = models.URLField()
    link = models.URLField()
    duration = models.TextField()
    
    def __str__(self):
        return f'{self.name}'


class Recent_played(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='lrecent_played')
    song_id = models.CharField( max_length=200)
    name = models.CharField(max_length=200)
    artist = models.CharField(max_length=200)
    img = models.URLField()
    link = models.URLField()
    duration = models.TextField()
    time = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f'{self.name}'