# Generated by Django 4.0.6 on 2024-04-07 18:02

from django.db import migrations, models
import django.db.models.deletion
import django_countries.fields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='playlist',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
            ],
        ),
        migrations.CreateModel(
            name='user_data',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50, unique=True)),
                ('email', models.EmailField(max_length=254)),
                ('gender', models.CharField(choices=[('Male', 'Male'), ('Female', 'Female'), ('Null', 'Prefer Not to Say')], default='Null', max_length=200)),
                ('dob', models.DateField()),
                ('nationality', django_countries.fields.CountryField(max_length=2)),
            ],
        ),
        migrations.CreateModel(
            name='playlist_songs',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('song_id', models.CharField(max_length=200, unique=True)),
                ('name', models.CharField(max_length=200)),
                ('artist', models.CharField(max_length=200)),
                ('img', models.URLField()),
                ('link', models.URLField()),
                ('playlist', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='playlist', to='app.playlist')),
            ],
        ),
        migrations.AddField(
            model_name='playlist',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='playlist_user', to='app.user_data'),
        ),
        migrations.CreateModel(
            name='liked_songs',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('song_id', models.CharField(max_length=200, unique=True)),
                ('name', models.CharField(max_length=200)),
                ('artist', models.CharField(max_length=200)),
                ('img', models.URLField()),
                ('link', models.URLField()),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='liked_user', to='app.user_data')),
            ],
        ),
    ]