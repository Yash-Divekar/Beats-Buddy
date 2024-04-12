from django.contrib import admin
from .models import *
# Register your models here.

admin.site.register(user_data)
admin.site.register(playlist)
admin.site.register(liked_songs)
admin.site.register(playlist_songs)