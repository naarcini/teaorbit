from django.db import models
import datetime

class Message(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, null=True)
    message = models.TextField()
    latitude = models.FloatField()
    longitude = models.FloatField()
    ip = models.CharField(max_length=100)
    date = models.DateTimeField()
	
    class Meta:
        db_table = 'messages'
        ordering = ['date']

    def __unicode__(self):
        return "[{ip}, {date}] {message}".format(ip=self.ip, date=self.date, message=self.message)

