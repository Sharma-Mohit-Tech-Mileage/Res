// NotificationSection.js
import React from 'react';
import { View, Text, Pressable, Image, StyleSheet } from 'react-native';
import { Color, Padding, FontSize, FontFamily, Border } from '../../../../GlobalStyles';
import Checkcircle from '../../../../assets/svgs/Checkcircle';
import Checkcircle1 from '../../../../assets/svgs/Checkcircle1';
import InfoICon from '../../../../assets/svgs/Infocircle';
import SmallLoader from '../../..//components/common/customui/SmallLoader';

// Sub-components
const StatusIcon = ({ status }) => (
  <View
    style={styles.icon}
>
  {status==='On'? <Checkcircle /> : <Checkcircle1 />}
</View>
);

const InfoIcon = () => (
  <View style={styles.icon}>
    <InfoICon />
  </View>
);

const EditButton = ({ onPress }) => (
  <Pressable
    style={({ pressed }) => [
      styles.editButton,
      pressed && styles.editButtonPressed
    ]}
    accessible={true}
    accessibilityRole="button"
    accessibilityLabel="Edit notifications"
    onPress={onPress}
  >
    <Text style={styles.editButtonText}>Edit</Text>
  </Pressable>
);

const ComingSoonBadge = () => (
  <View style={styles.comingSoonBadge}>
    <Text style={styles.comingSoonText}>Coming Soon</Text>
  </View>
);

const NotificationToggle = ({ type, status, isLast, warn,loading }) => (
  <View style={[
    styles.toggleContainer,
    !isLast && styles.bottomBorder,
    warn && styles.warnBackground
  ]}>
    <Text style={styles.toggleText}>{type}</Text>
    
   <View style={styles.statusContainer}>
      <StatusIcon status={status} />

      { loading ?  <SmallLoader/> : <Text style={styles.statusText}>{status}</Text>}
    </View>
  </View>
);

const BoldEmailText = ({ message }) => {
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
  const parts = message.split(emailRegex);
  const emails = message.match(emailRegex);
 console.log(emails);
 return (
  <Text>
    {parts.map((part, index) => (
      <React.Fragment key={index}>
        {part}
        {emails && emails[index] && <Text style={[styles.infoText,{fontWeight:'600',color:Color.colorGray_200}]}>{emails[index]}</Text>}
      </React.Fragment>
    ))}
  </Text>
);
};

const BoldPhoneText = ({ phoneNum }) => {
 return (
  
  <Text style={[styles.infoText]}>
      <React.Fragment>

        {phoneNum?'Text alert are sent to ' :'You have not enabled text notifications'}
        { <Text style={[styles.infoText,{fontWeight:'600',color:Color.colorGray_200}]}>{phoneNum}</Text>}
      </React.Fragment>
    
  </Text>
);
};
const InfoMessage = ({ message,phoneNumber,id }) => (
  <View style={styles.infoMessage}>
    <InfoIcon />
    <Text style={styles.infoText}>
      {id=='text'? <BoldPhoneText phoneNum ={phoneNumber}/> : <BoldEmailText message={message}/>}</Text>
  </View>
);

const AdminMessage = () => (
  <View style={styles.adminMessage}>
    <Text style={styles.adminText}>
      Only Primary Admin can make changes
    </Text>
  </View>
);

// Main component
const NotificationSection = ({
  id,
  title,
  infoMessage,
  settings = [],
  isComingSoon = false,
  isAdmin = false,
  isLoading=false,
  onEdit,
  phoneNumber
}) => {
  return (
    <View style={styles.sectionContainer}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {isComingSoon ? (
          <ComingSoonBadge />
        ) : !isAdmin && (
          <EditButton onPress={onEdit} />
        )}
      </View>

      {/* Admin Message */}
      {isAdmin && <AdminMessage />}

      {/* Info Message */}
      {infoMessage && <InfoMessage message={infoMessage} phoneNumber={phoneNumber} id={id}/>}
      <View style={styles.bottomBorder} />

      {/* Settings List */}
      {settings.map((setting, index) => (
        <NotificationToggle
          key={setting.id}
          {...setting}
          isLast={index === settings.length - 1}
          loading={isLoading}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  // Section Container
  sectionContainer: {
    backgroundColor: Color.sparklightWhite,
    borderRadius: Border.br_5xs,
    borderWidth: 1,
    borderColor: Color.sparklightGray,
    marginBottom: Padding.p_base,
    overflow: 'hidden'
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Padding.p_base
  },
  title: {
    fontSize: FontSize.size_3xl,
    fontFamily: FontFamily.openSansRegular,
    color: Color.sparklightGray1
  },

  // Edit Button
  editButton: {
    backgroundColor: Color.colorMidnightblue,
    paddingVertical: Padding.p_7xs,
    paddingHorizontal: Padding.p_base,
    borderRadius: Border.br_11xs,
    minWidth: 70,
    alignItems: 'center'
  },
  editButtonPressed: {
    opacity: 0.8
  },
  editButtonText: {
    fontSize: FontSize.size_sm,
    fontFamily: FontFamily.openSansRegular,
    color: Color.sparklightWhite
  },

  // Coming Soon Badge
  comingSoonBadge: {
    backgroundColor: Color.sparklightGray,
    paddingVertical: Padding.p_9xs,
    paddingHorizontal: Padding.p_base,
    borderColor: Color.sparklightGray1,
    borderWidth: 1,
  },
  comingSoonText: {
    fontSize: FontSize.textXsSemibold_size,
    fontFamily: FontFamily.openSansRegular,
    color: Color.sparklightGray1
  },

  // Info Message
  infoMessage: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: Padding.p_base,
    marginHorizontal: Padding.p_base,
    marginBottom: Padding.p_base,
    borderRadius: Border.br_5xs,
    borderWidth: 1,
    borderColor: '#0060AE',
    backgroundColor: '#F0F8FF',
  },
  infoText: {
    flex: 1,
    marginLeft: Padding.p_5xs,
    fontSize: FontSize.textXsSemibold_size,
    fontFamily: FontFamily.openSansRegular,
    color: Color.colorGray_200
  },

  // Toggle
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Padding.p_base
  },
  bottomBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Color.sparklightGray
  },
  toggleText: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.openSansRegular,
    color: Color.colorGray_200
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  statusText: {
    marginLeft: Padding.p_5xs,
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.openSansRegular,
    color: Color.colorGray_200
  },

  icon: {
    width: 18,
    height: 18
  },

  // Admin Message
  adminMessage: {
    backgroundColor: Color.colorWhitesmoke_100,
    padding: Padding.p_base,
    marginBottom: Padding.p_base
  },
  adminText: {
    textAlign: 'center',
    fontSize: FontSize.textXsSemibold_size,
    fontFamily: FontFamily.openSansRegular,
    color: Color.colorGray_200
  },

  // Warning state
  warnBackground: {
    backgroundColor: Color.colorlightRed
  }
});

export default NotificationSection;