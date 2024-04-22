from django.contrib import admin
from .models import *
# Register your models here.

admin.site.register(UserData)
admin.site.register(Playlist)
admin.site.register(LikedSongs)
admin.site.register(PlaylistSongs)
admin.site.register(recent_played)