from django.contrib import admin
from django.urls import path, include
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from django.conf import settings
from django.conf.urls.static import static

schema_view = get_schema_view(
   openapi.Info(
      title="Archimed Test API",
      default_version='v0',
      description="Description",
   ),
   public=True,
)

urlpatterns = [

    path('admin/', admin.site.urls),
    path('docs/', schema_view.with_ui('swagger', cache_timeout=0),name='schema-swagger-ui'),
    path('', include(('app.urls', 'app'), namespace='app'))

]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)