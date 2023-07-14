# Generated by Django 4.2.2 on 2023-07-13 19:55

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("cgrants", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="subscription",
            name="is_mainnet",
            field=models.BooleanField(
                default=False, help_text="Is the network for this subscription mainnet?"
            ),
        ),
    ]
