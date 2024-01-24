/* eslint-disable react-native/no-inline-styles */
import React, { useState,useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import { SegmentedArc } from '../common/arcchart/SegmentedArc';
import moment from 'moment';
import colors from '../../res/Colors';
import { FontFamily } from '../../../GlobalStyles';

const InternetHealthChart= ({currentValue}) => {
  const [showArcRanges, setShowArcRanges] = useState(false);
  const [ todayDate, setTodayDate]= useState("");
  const segments = [
    {
      scale: 0.33,
      filledColor: '#DF2600',
      emptyColor: '#DF2600',
      data: { label: 'Offline' }
    },
    {
      scale: 0.33,
      filledColor: '#FBB231',
      emptyColor: '#FBB231',
      data: { label: 'Poor' }
    },
    {
      scale: 0.33,
      filledColor: '#2BA948',
      emptyColor: '#2BA948',
      data: { label: 'Optimal' }
    },
    
  ];

  const ranges = ['10', '20', '30','40'];

  const _handlePress = () => {
    setShowArcRanges(!showArcRanges);
  };
  
  const getIndicatorColor=(currentValue)=>{

    if(currentValue < 33 && currentValue >0){
      return '#DF2600'
    }else if(currentValue >=33 && currentValue <66){
      return '#FBB231'
    }else if(currentValue >=66 && currentValue <99){
      return '#2BA948'
    }else{
      return '#2BA948'
    }

  }

  useEffect(()=>{
    //moment().format("MMM Do YY");
    let currentDate = moment().format('ll')
    setTodayDate(currentDate)
    console.log('CurrentValue',currentValue)
  },[currentValue])

  return (
    <View style={{  alignItems: 'center', justifyContent: 'center'}}>
      <SegmentedArc
        segments={segments}
        fillValue={currentValue}
        isAnimated={true}
        animationDelay={1000}
        showArcRanges={showArcRanges}
        ranges={ranges}
        radius={110}
        capInnerColor={getIndicatorColor(currentValue)}
        
      >
        {metaData => (
          <Pressable onPress={_handlePress} style={{ alignItems: 'center' }}>
            <Text
              allowFontScaling={false}
              style={
                { 
                  fontSize: 24, 
                  paddingTop: 20,
                  fontWeight:"600",
                  color:colors.darkest_grey,
                  fontFamily:FontFamily.openSansRegular 
              }
            }>{metaData.lastFilledSegment.data.label}</Text>
            <Text
              allowFontScaling={false}
              style={{ marginTop:10, fontSize: 11.7,color:'#767676',textAlign:'center',fontFamily:FontFamily.openSansRegular }}>Updated {todayDate}</Text>
          </Pressable>
        )}
      </SegmentedArc>
    </View>
  );
};

export default InternetHealthChart;