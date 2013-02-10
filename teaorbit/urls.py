from django.conf.urls.defaults import patterns, include, url
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('teaorbit.views',
    url(r'^$', 'index', name='index'),
    url(r'^admin/', include(admin.site.urls)),

    url(r'^post/?$', 'post', name='post'),
    url(r'^messages/?$', 'messages', name='messages'),
)
