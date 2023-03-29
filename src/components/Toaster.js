import Toast from 'react-native-root-toast';

export const Toaster = ({title,type = "Succes"}) => Toast.show(title, {
        duration: Toast.durations.LONG,
        position: Toast.positions.CENTER,
        shadow: false,
        animation: true,
        hideOnPress: true,
        containerStyle:{
          backgroundColor:type == "Succes"?"#08d":"#f00",
          borderRadius:15,
          paddingHorizontal:25
        },
        keyboardAvoiding:true,
        textStyle:{
        //   fontFamily:fonts.titlex3,
          fontSize:15
        },
        delay: 0,
        onShow: () => {
            // calls on toast\`s appear animation start
        },
        onShown: () => {
            // calls on toast\`s appear animation end.
        },
        onHide: () => {
            // calls on toast\`s hide animation start.
        },
        onHidden: () => {
            // calls on toast\`s hide animation end.
        }
    });
 