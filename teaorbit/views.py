from teaorbit.shortcuts import template_response, json_response, html_response, not_found, redirect, now, datetime_to_unix
from django.db.models import Q
from django.contrib.humanize.templatetags.humanize import naturaltime
from teaorbit.models import Message
from datetime import datetime


def index(request):
    messages = Message.objects.filter()
    response = {
        'messages': messages,
        'timestamp': now(),
    }
    return template_response('teaorbit/index.html', response, request)

def game(request):
    response = {}
    return template_response('wearahat/index.html', response, request)

def messages(request):
    date = datetime.utcnow()
    if request.method != 'POST':
        response = {
            'status': 'error',
            'details': 'Post please.',
        }
    elif 'latitude' not in request.POST or 'longitude' not in request.POST:
        reponse = {
            'status': 'error',
            'details': 'You must provide coordinates.',
        }
    else:
        latitude = request.POST['latitude']
        longitude = request.POST['longitude']

        last_id = float(request.POST.get('last_id', '0'))
        messages = Message.objects.filter(id__gt=last_id)

        response = {
            'messages': [ {
                'id': message.id,
                'name': message.name,
                'message': message.message,
                'date': datetime_to_unix(message.date)
            } for message in messages ]
        }

    return json_response(response)

def post(request):

    message = Message(
        message=request.POST['message'].strip(),
        name=request.POST['name'].strip(),
        latitude=float(request.POST['latitude']),
        longitude=float(request.POST['longitude']),
        ip=request.META['REMOTE_ADDR'],
        date=datetime.utcnow(),
    )

    if len(message.message) > 0:
        message.save()
        response = {
            'status': 'ok',
        }
    else:
        # do nothing
        response = {
            'status': 'ok',
        }
    return json_response(response)
