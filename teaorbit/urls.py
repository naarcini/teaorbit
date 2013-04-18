from django.conf.urls.defaults import patterns, include, url
from django.contrib import admin
from django.conf import settings
import os

admin.autodiscover()

urlpatterns = patterns('teaorbit.views',
    url(r'^$', 'game', name='game'),
    url(r'^chat/?$', 'index', name='index'),
    url(r'^admin/', include(admin.site.urls)),

    url(r'^post/?$', 'post', name='post'),
    url(r'^messages/?$', 'messages', name='messages'),
)

urlpatterns += patterns('',
    url(r'^static/(?P<path>.*)$', 'django.views.static.serve', {'document_root': os.path.join(settings.FILE_ROOT, 'static/')}),
)
