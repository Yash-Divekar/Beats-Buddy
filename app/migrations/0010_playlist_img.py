# Generated by Django 4.0.6 on 2024-05-22 13:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0009_likedsongs_time'),
    ]

    operations = [
        migrations.AddField(
            model_name='playlist',
            name='img',
            field=models.URLField(default='https://images.unsplash.com/photo-1559251606-c623743a6d76?ixlib=rb-4.0.3'),
            preserve_default=False,
        ),
    ]