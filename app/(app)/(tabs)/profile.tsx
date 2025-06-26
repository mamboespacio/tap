import LinkedButton from '@/components/ui/LinkedButton';
import { View, Text, Pressable } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSessionStore } from "@/data/SessionStore";
import { useUserStore } from '@/data/UserStore';

export default function AboutScreen() {
  const {removeSession} = useSessionStore();
  const {removeUser} = useUserStore();

  const handleCloseSession = () => {
    removeSession()
    removeUser()
  }
  return (
    <View className='p-4 gap-4'>
      <View className="bg-gray-200 p-4 rounded-xl gap-1">
        <Text className="font-semibold text-base">Ema Dobao</Text>
        <Text>emadobao@gmail.com</Text>
      </View>
      <View className='gap-2'>
        <Text className='font-semibold'>Tu Actividad</Text>
        <LinkedButton href="/profile/addresses" textAlign='left' text="Direcciones"/>
        <LinkedButton href="/profile/favourites" textAlign='left' text="Favoritos"/>
        <LinkedButton href="/cards" textAlign='left' text="Tarjetas Guardadas"/>
        <LinkedButton href="/orders" textAlign='left' text="Historial de Órdenes"/>
      </View>
      <View className='gap-2'>
        <Text className='font-semibold'>Configuración</Text>
        <LinkedButton href="/faq" textAlign='left' text="Preguntas frecuentes"/>
        <LinkedButton href="/legal" textAlign='left' text="Información Legal"/>
        <LinkedButton href="/notifications" textAlign='left' text="Notificaciones"/>
      </View>
      <View className='gap-2'>
        <Pressable
          onPress={() => handleCloseSession()}
        >
          <Text className="flex items-center"><Ionicons name='log-out-sharp' size={20} /> Cerrar sesión</Text>
        </Pressable>
      </View>
    </View>
  );
}