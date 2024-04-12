from django import forms
from .models import user_data
from django.contrib.auth.models import User


class User_Form(forms.ModelForm):
    class Meta:
        model = user_data
        fields = ['name', 'email', 'gender', 'dob', 'nationality']
        
        widgets={
            'name' : forms.TextInput(attrs={'class':'form-control'}),
            'email':forms.TextInput(attrs={'class':'form-control'}),
            'gender':forms.Select(attrs={'class':'form-control'}),
            'dob' : forms.DateInput(attrs={'class':'form-control'}),
            'nationality' : forms.Select(attrs={'class':'form-control'})  
        }

        