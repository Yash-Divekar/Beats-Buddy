from django.contrib import admin
from .models import *
# Register your models here.
class display_list(admin.ModelAdmin):
    list_display = ('user', 'song_id', 'name', 'artist', 'time')
    
admin.site.register(UserData)
admin.site.register(Playlist)
admin.site.register(LikedSongs,display_list)
admin.site.register(PlaylistSongs)
admin.site.register(Recent_played, display_list)
