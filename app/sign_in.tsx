import { HeaderScreen } from '@/components/ui/HeaderScreen'
import { useRouter } from 'expo-router'
import { Text, View } from 'react-native'

export default function Index() {
  const router = useRouter();
  return (
    <View>
      <HeaderScreen backAction={()=> router.back()} title='Sign In '/>
        <Text>Sign In Screen</Text>
    </View>
  )
}
