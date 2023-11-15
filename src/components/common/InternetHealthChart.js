/* eslint-disable react-native/no-inline-styles */
import React, { useState,useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import { SegmentedArc } from '../common/arcchart/SegmentedArc';
import moment from 'moment';
import colors from '../../res/Colors';

const InternetHealthChart= () => {
  const [showArcRanges, setShowArcRanges] = useState(false);
  const [ todayDate, setTodayDate]= useState("");



  const segments = [
    {
      scale: 0.33,
      filledColor: '#DF2600',
      emptyColor: '#DF2600',
      data: { label: 'Poor' }
    },
    {
      scale: 0.33,
      filledColor: '#FBB231',
      emptyColor: '#FBB231',
      data: { label: 'Good' }
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


  useEffect(()=>{
    //moment().format("MMM Do YY");
    let currentDate = moment().format('ll')
    setTodayDate(currentDate)
  },[])

  return (
    <View style={{  alignItems: 'center', justifyContent: 'center'}}>
      <SegmentedArc
        segments={segments}
        fillValue={90}
        isAnimated={true}
        animationDelay={1000}
        showArcRanges={showArcRanges}
        ranges={ranges}
        radius={110}
        capInnerColor='#2BA948'
        
      >
        {metaData => (
          <Pressable onPress={_handlePress} style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 24, paddingTop: 20,fontWeight:"600",color:colors.darkest_grey }}>{metaData.lastFilledSegment.data.label}</Text>
            <Text style={{ marginTop:10, fontSize: 12,color:'#767676',textAlign:'center' }}>Updated {todayDate}</Text>
          </Pressable>
        )}
      </SegmentedArc>
    </View>
  );
};

export default InternetHealthChart;