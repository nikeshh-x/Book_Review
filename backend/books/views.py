from django.shortcuts import render
from django.contrib.auth.models import User
from .models import Book, Review, Rating
from .serializers import ReviewSerializer, RatingSerializer, BookSerializer, UserSerializer, RegisterSerializer
from rest_framework import viewsets
from rest_framework import permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status, generics

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class CurrentUserView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all().prefetch_related('ratings', 'reviews')
    serializer_class = BookSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    @action(detail=True, methods=['POST'])
    def rate_book(self, request, pk=None):
        book = self.get_object()
        score = request.data.get('score')

        if not score or score not in range(1, 6):
            return Response({'error': 'Score must be 1-5'}, status=400)

        rating, created = Rating.objects.update_or_create(
            user=request.user,
            book=book,
            defaults={'score':score}
        )
        return Response(RatingSerializer(rating).data)
    
    @action(detail=True, methods=['POST'])
    def add_review(self, request, pk=None):
        book = self.get_object()
        serializer = ReviewSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user, book=book)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['PUT'], permission_classes=[permissions.IsAuthenticated])
    def edit_review(self, request, pk=None):
        review_id = request.data.get('review_id')
        try:
            review = Review.objects.get(id=review_id, user=request.user)
        except Review.DoesNotExist:
            return Response({'error': 'Review not found'}, status=404)

        serializer = ReviewSerializer(review, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    @action(detail=True, methods=['DELETE'], permission_classes=[permissions.IsAuthenticated])
    def delete_review(self, request, pk=None):
        review_id = request.data.get('review_id')
        try:
            review = Review.objects.get(id=review_id, user=request.user)
            review.delete()
            return Response({'message':'Review Deleted'}, status=204)
        except:
            return Response({'error': 'Review not found'}, status=404)
    
    @action(detail=True, methods=['GET'])
    def user_rating(self, request, pk=None):
        book = self.get_object()
        if request.user.is_authenticated:
            rating = Rating.objects.filter(user=request.user, book=book).first()
            if rating:
                return Response({'score': rating.score})
        return Response({'score': None})

