# Generated by Django 4.1.1 on 2022-09-12 22:54

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('to_do_api', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='task',
            old_name='task',
            new_name='title',
        ),
    ]