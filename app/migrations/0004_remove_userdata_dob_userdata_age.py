# Generated by Django 4.0.6 on 2024-04-13 15:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0003_remove_userdata_email'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='userdata',
            name='dob',
        ),
        migrations.AddField(
            model_name='userdata',
            name='age',
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
    ]
