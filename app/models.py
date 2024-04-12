from django.db import models
from django_countries.fields import CountryField

genders = (("Male" , 'Male') , ("Female" , "Female") , ("Null" , "Prefer Not to Say"))

class user_data(models.Model):
    name = models.CharField(max_length=50 , unique=True )
    email = models.EmailField()
    gender = models.CharField(choices=genders , default="Null" ,max_length=200)
    dob = models.DateField()
    nationality = CountryField()
    
    def __str__(self):
        return f'{self.name}'
    
    class Meta:
        app_label = 'app'
    
class liked_songs(models.Model):
    user = models.ForeignKey(user_data, on_delete=models.CASCADE, related_name='liked_user')
    song_id = models.CharField(unique=True , max_length=200)
    name = models.CharField(max_length=200)
    artist = models.CharField(max_length=200)
    img = models.URLField()
    link = models.URLField()
    
    def __str__(self):
        return  f'{self.name}'
    
    class Meta:
        app_label = 'app'
    
    
class playlist(models.Model):
    user = models.ForeignKey(user_data, on_delete=models.CASCADE, related_name='playlist_user')
    name = models.CharField(max_length=200)
    
    def __str__(self):
        return f'{self.name}'
    
    class Meta:
        app_label = 'app'
    
class playlist_songs(models.Model):
    playlist = models.ForeignKey(playlist, on_delete=models.CASCADE, related_name='playlist')
    song_id = models.CharField(unique=True , max_length=200)
    name = models.CharField(max_length=200)
    artist = models.CharField(max_length=200)
    img = models.URLField()
    link = models.URLField()
    
    def __str__(self):
        return  f'{self.name}'
    
    class Meta:
        app_label = 'app'