from django.contrib import admin
from .models import Book, Review, Rating


admin.site.register(Book)
admin.site.register(Review)
admin.site.register(Rating)