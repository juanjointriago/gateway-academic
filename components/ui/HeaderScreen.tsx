import { FC } from "react";
import { Text, View } from "react-native"
import { Appbar } from "react-native-paper";

interface Props{
    title?: string;
    isBackButton?:true;
    backAction?: ()=>void;
}
export const HeaderScreen:FC<Props> = ({title = 'No title', isBackButton = false, backAction = ()=>console.log("Not setted header back action")}) => {
  return (
    <View>
        <Appbar.Header style={{backgroundColor: 'white'}}>
            <Appbar.Action
            icon={'arrow-left'}
            onPress={backAction}
            />
            <Appbar.Content
            title={title}
            color="blue"
            titleStyle={{ fontFamily: "Poppins_Regular", fontSize: 16 }}
            />
        </Appbar.Header>
    </View>
  )
}
