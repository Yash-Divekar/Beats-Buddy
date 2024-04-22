from django import forms
from .models import UserData
from django.contrib.auth.models import User

class User_Form(forms.ModelForm):
    class Meta:
        model=User
        fields = ['username' , 'password' , 'email']

        widgets={
            'username' : forms.TextInput(attrs={'class':'form-control', 'placeholder':'Enter unique Username'} ),
            'password': forms.PasswordInput(attrs={'class': 'form-control', 'placeholder': 'Enter password'}),
            'email':forms.TextInput(attrs={'class':'form-control' , 'placeholder':"Enter valid Email address"}),
        }
        
class User_Data_Form(forms.ModelForm):
    class Meta:
        model = UserData
        fields = ['name', 'gender', 'age', 'nationality']
        
        widgets={
            'name' : forms.TextInput(attrs={'class':'form-control', 'placeholder':'Enter display name'}),
            'gender':forms.Select(attrs={'class':'form-control'}),
            'age' : forms.NumberInput(attrs={'class':'form-control', 'placeholder':'Enter your age'}),
            'nationality' : forms.Select(attrs={'class':'form-control'})  
        }

        