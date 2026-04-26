from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver

from api.models import Notificacion


def _notify_user_notifications_changed(user_unique_id):
    channel_layer = get_channel_layer()
    if not channel_layer:
        return
    group_name = f"notificaciones_{str(user_unique_id).replace('-', '')}"
    async_to_sync(channel_layer.group_send)(
        group_name,
        {"type": "notifications.refresh"},
    )


@receiver(post_save, sender=Notificacion)
def notify_on_notificacion_save(sender, instance, **kwargs):
    _notify_user_notifications_changed(instance.user_destino.unique_id)


@receiver(post_delete, sender=Notificacion)
def notify_on_notificacion_delete(sender, instance, **kwargs):
    _notify_user_notifications_changed(instance.user_destino.unique_id)
