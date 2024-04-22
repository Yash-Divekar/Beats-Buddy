# Generated by Django 4.0.6 on 2024-04-21 14:02

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('app', '0005_alter_likedsongs_user'),
    ]

    operations = [
        migrations.AlterField(
            model_name='likedsongs',
            name='song_id',
            field=models.CharField(max_length=200),
        ),
        migrations.AlterField(
            model_name='playlistsongs',
            name='song_id',
            field=models.CharField(max_length=200),
        ),
        migrations.CreateModel(
            name='recent_played',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('song_id', models.CharField(max_length=200)),
                ('name', models.CharField(max_length=200)),
                ('artist', models.CharField(max_length=200)),
                ('img', models.URLField()),
                ('link', models.URLField()),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='lrecent_played', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
