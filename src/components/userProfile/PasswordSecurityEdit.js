import React, { useState, useEffect, useRef } from "react";
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { StyleSheet,TouchableOpacity, Text, Pressable, View, ScrollView } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { FontFamily, Padding, Color, FontSize, Border } from "../../../GlobalStyles";
import { validatePassword, passwordTerms,securityQuestions } from "../utility/constant";
import SparkLightInput from '../common/customui/SparkLightInput';
import SparkLightDropdown from '../common/customui/SparkLightDropdown';
import ProfileSettingsHeader from '../common/ProfileSettingsHeader';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from "../../redux/utils/LocalStorage";
import NotificationAlert from '../common/customui/NotificationAlert';
import { updateProfileSecurity } from '../../redux/actions/ProfileActionSuite';
import { GetApiRequest,PutApiRequest } from "../../network/APIClient";
import LoadingOverlay from "../common/customui/CustomLoading";
import { passwordSchema } from '../utility/validationSchema'; // Update the path as necessary
import colors from "../../res/Colors";
const PasswordSecurityEdit = () => {

  const navigation = useNavigation();
  const [isCustomQuestionSelected, setIsCustomQuestionSelected] = useState(false);
  const [isNewBiller, setIsNewBiller] = useState(false);
  const [customSecurityQuestion, setCustomSecurityQuestion] = useState('');
  const [mySecurityQuestion, setMySecurityQuestion] = useState('');
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showValidationAlert, setShowValidationAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingTxt, setLoadingTxt] = useState("Please wait...");
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [securityQuestionsNew,setSecurityQuestionsNew] =useState(securityQuestions)
  const route = useRoute(); // Use the useRoute hook
  const dispatch = useDispatch();
  const profile = useSelector(state => state.combinedReducers.profile || {});
  const profileDetailsfromStore = profile.profileDetails || {}; // Defaulting to an empty array if userList is undefined
  const [profileDetails, setLocalProfile] = useState(profileDetailsfromStore);
  const scrollViewRef = useRef(null);

  // Handler for when the security question dropdown value changes
  const handleSecurityQuestionChange = (itemValue) => {
    setLocalProfile({ ...profileDetails, securityQuestion: itemValue === "Add your own question" ? '' : itemValue });
    setCustomSecurityQuestion(itemValue);
    setIsDropDownOpen(false)
    setIsCustomQuestionSelected(itemValue === "Add your own question");
  };


  const handleSave = (formData) => {
    console.log("request save data",JSON.stringify(formData))
    setLoading(true)
    formData.securityQuestion=(isCustomQuestionSelected)? formData.securityQuestion : customSecurityQuestion
    dispatch(updateProfileSecurity(formData, navigation)); // Dispatch with formData
   
  };

  


  const { control, handleSubmit, setValue, reset, formState: { errors } } = useForm({
    resolver: yupResolver(passwordSchema(isCustomQuestionSelected)),
    defaultValues: profileDetails
  });

  const handleValidationError = () => {
    scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
    setShowValidationAlert(true);
  };


  const getSecurityQuestions=()=>{
    const request = `usersvc/api/securityquestions/`;
    GetApiRequest(
      request,
      (res) => {
        console.log("getSecurityQuestions", res);
        if (res) {
          setSecurityQuestionsNew(res)
          checkCustomSecurityQuestion(res)
        }
        
      },
      (error) => {
        console.log(error);
      }
    );
  }
  //usersvc/api/profile/password/8160210010000010

  

  useEffect(() => {
    // Reset the form with the updated profile details
    //reset(profileDetails);
    setLoading(false)
  }, [profileDetails, reset]);


  const checkCustomSecurityQuestion=(securityQuestions)=>{
      console.log('Profile Details',profileDetails)
    const storedSecurityQuestion = profileDetails.securityQuestion;
    const isCustomQuestion = storedSecurityQuestion && !securityQuestionsNew.includes(storedSecurityQuestion);
    setIsCustomQuestionSelected(isCustomQuestion);
    if (isCustomQuestion) {
      setCustomSecurityQuestion("Add your own question");
    } else {
      setCustomSecurityQuestion(storedSecurityQuestion);
    }
  }

  useEffect(()=>{
    const storedSecurityQuestion = profileDetails.securityQuestion;
    const isCustomQuestion = storedSecurityQuestion && !securityQuestionsNew.includes(storedSecurityQuestion);
    setIsCustomQuestionSelected(isCustomQuestion);
    if (isCustomQuestion) {
      setCustomSecurityQuestion("Add your own question");
    } else {
      setCustomSecurityQuestion(storedSecurityQuestion);
    }

  },[])

  useEffect(() => {
    let re = getUser().then((res) => {
      if(res.userInfo.accountNumber.toString().length>=16){
        setIsNewBiller(true)
      }
    });
   
    if(isNewBiller){
      getSecurityQuestions();
    }else{
      
     

    }
  }, [isNewBiller]);

  useEffect(() => {
    if (route.params?.updateFailed) {
      setShowErrorAlert(true);
      scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
      navigation.setParams({ updateFailed: undefined });
    }
  }, [route.params?.updateFailed, navigation, dispatch]);


  return (
    <View style={styles.passwordSecurityEdit}
    accessibilityElementsHidden={isDropDownOpen}
    importantForAccessibility= {isDropDownOpen ? "no-hide-descendants" : 'no'}
    >
      <ProfileSettingsHeader
        accessibilityElementsHidden={isDropDownOpen}
        importantForAccessibility= {isDropDownOpen ? "no-hide-descendants" : 'no'}
        title="Edit Security Question"
        onPressBack={() => navigation.navigate('PasswordSecurity')}
      />
      <ScrollView ref={scrollViewRef} >
        <View style={styles.passwordSecurityEditInner}>
          <View style={styles.frameParent}>
            <View style={[styles.frameGroup, styles.wrapperSpaceBlock1]}>
              <View style={styles.infoWrapper}>
              <NotificationAlert
                type="error"
                title="Failed"
                message="Password and security update failed."
                showCloseIcon={true}
                isVisible={showErrorAlert}
                onClose={() => setShowErrorAlert(false)}
              />
                <NotificationAlert
                  type="error"
                  title="Error"
                  message="Please enter valid information to continue."
                  showCloseIcon={true}
                  isVisible={showValidationAlert}
                  onClose={() => setShowValidationAlert(false)}
                />
              </View>
              <View style={styles.frameParent1}>
                <View 
                accessibilityElementsHidden={isDropDownOpen}
                importantForAccessibility= {isDropDownOpen ? "no-hide-descendants" : 'no'}
                style={styles.securityQuestionWrapper}>
                  <Text style={[styles.password, styles.passwordFlexBox]} >Security Question</Text>
                </View>
                <View 
                style={[styles.textinputWrapper, styles.wrapperSpaceBlock1]}>
                  <View style={styles.textinput}>
                    <Text 
                    accessibilityElementsHidden={isDropDownOpen}
                    importantForAccessibility= {isDropDownOpen ? "no-hide-descendants" : 'no'}
                     style={[styles.firstName1, styles.firstTypo]} > Password Reset Question</Text>
                    <SparkLightDropdown
                    accessibilityElementsHidden={isDropDownOpen}
                    importantForAccessibility= {isDropDownOpen ? "no-hide-descendants" : 'no'}
                      items={securityQuestionsNew}
                      selectedValue={customSecurityQuestion}
                      onValueChange={handleSecurityQuestionChange}
                      isDropDownOpen={(value) => {
                        setIsDropDownOpen(true)
                      }}
                    />
                  </View>
                </View>
                {isCustomQuestionSelected && (
                  <View 
                 accessibilityElementsHidden={isDropDownOpen}
                 importantForAccessibility= {isDropDownOpen ? "no-hide-descendants" : 'no'}
                  style={[styles.textinputWrapper, styles.wrapperSpaceBlock1]}>
                    <View style={styles.textinput}>
                      <Controller
                        control={control}
                        name="securityQuestion"
                        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                          <>
                            <SparkLightInput
                              onBlur={onBlur}
                              label={'Type your Question'}
                              onChangeText={onChange}
                              value={value}
                              error={error?.message}
                            />
                          </>
                          
                        )}
                      />
                    </View>
                  </View>
                )}
                <View 
                accessibilityElementsHidden={isDropDownOpen}
                importantForAccessibility= {isDropDownOpen ? "no-hide-descendants" : 'no'}
                style={[styles.textinputWrapper, styles.wrapperSpaceBlock1]}>
                    <Controller
                      control={control}
                      name="securityAnswer"
                      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                        <>
                          <SparkLightInput
                            onBlur={onBlur}
                            onChangeText={onChange}
                            label={"Password Reset Answer"}
                            value={value}
                            error={error?.message}
                          />
                        </>
                      )}
                    />
                </View>
              </View>
            </View>
          </View>
          <View style={styles.frameParent1}>
            <Pressable 
             accessibilityLabel={'Save'}
             accessibilityRole="button"
             accessible={true}
            style={[styles.buttons, styles.buttonsLayout]}
              onPress={handleSubmit(handleSave, handleValidationError)}>
              <Text style={[styles.makePayment, styles.makeTypo]}> Save </Text>
            </Pressable>
            <Pressable 
             accessibilityLabel={`Cancel`}
             accessibilityRole="button"
             accessible={true}
            style={[styles.buttons1, styles.buttonsLayout]} onPress={() => navigation.navigate("PasswordSecurity")}>
              <Text style={[styles.makePayment1, styles.makeTypo]}> Cancel</Text>
            </Pressable>
          </View>

          <LoadingOverlay
                loading={loading}
                loadingTxt={loadingTxt}
                onRequestClose={() => {
                  setLoading(false);
                }}
              />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapperSpaceBlock1: {
    paddingVertical: Padding.p_base,
    alignSelf: "stretch",
  },
  infoWrapper: {
    paddingHorizontal: Padding.p_5xl,
    alignSelf: "stretch",
  },
  bulletPoiint: {
    color: Color.sparklightGray1, 
    fontFamily: FontFamily.openSansRegular, 
    fontSize: FontSize.size_xs, 
    fontStyle: 'normal',
    fontWeight: '400', 
    lineHeight: 19,
  },
  bulletPointContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  passwordFlexBox: {
    textAlign: "left",
    fontFamily: FontFamily.openSansRegular,
    color: Color.sparklightGray1,
  },
  firstTypo: {
    fontSize: FontSize.textXsSemibold_size,
    textAlign: "left",
    fontFamily: FontFamily.openSansSemiBold,
    fontWeight: "600",
  },
  wrapperSpaceBlock: {
    paddingVertical: 0,
    paddingHorizontal: Padding.p_5xl,
    alignSelf: "stretch",
  },
  buttonsLayout: {
    width: '100%',
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: Padding.p_base,
    paddingHorizontal: 0,
    borderRadius: Border.br_11xs,
    height: 56,
  },
  makeTypo: {
    width: 282,
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.openSansRegular,
    textAlign: "center",
  },

  password: {
    fontSize: FontSize.size_3xl,
    lineHeight: 28,
  },
  passwordWrapper: {
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: Padding.p_5xl,
  },
  bullet: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginRight: 10, 
  },
  firstName: {
    color: Color.sparklightGray1,
    fontSize: FontSize.textXsSemibold_size,
    flex: 1,
  },
  eyeIcon: {
    width: 16,
    height: 16,
    overflow: "hidden",
  },
  show: {
    marginLeft: 6,
    color: Color.colorMidnightblue,
    lineHeight: 28,
  },
  eyeParent: {
    marginLeft: 8,
    alignItems: "center",
    flexDirection: "row",
  },
  firstNameParent: {
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "stretch",
  },
  textinput: {
    justifyContent: "center",
    alignSelf: "stretch",
  },
  textinputWrapper: {
    justifyContent: "center",
    paddingHorizontal: Padding.p_5xl,
  },
  itMustBe: {
    lineHeight: 19,
    fontSize: FontSize.size_xs,
  },
  frameParent: {
    alignSelf: "stretch",
  },
  frameChild: {
    height: 1,
    backgroundColor: Color.sparklightGray,
    alignSelf: "stretch",
  },
  rectangleWrapper: {
    marginTop: Padding.p_base,
  },
  securityQuestionWrapper: {
    paddingBottom: Padding.p_5xs,
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: Padding.p_5xl,
    alignSelf: "stretch",
  },
  firstName1: {
    color: Color.sparklightGray1,
    fontSize: FontSize.textXsSemibold_size,
    alignSelf: "stretch",
  },
  frameParent1: {
    marginTop: 16,
    alignSelf: "stretch",
  },
  frameGroup: {
    paddingHorizontal: 0,
    borderWidth: 1,
    borderRadius: Border.br_11xs,
    paddingVertical: Padding.p_base,
    borderColor: Color.sparklightGray,
    borderStyle: "solid",
    backgroundColor: Color.sparklightWhite,
    overflow: "hidden",
  },
  makePayment: {
    color: Color.sparklightWhite,
  },
  buttons: {
    backgroundColor: Color.colorMidnightblue,
  },
  makePayment1: {
    color: Color.colorMidnightblue,
  },
  buttons1: {
    marginTop: 16,
    width: '100%',
  },
  passwordSecurityEditInner: {
    paddingVertical: Padding.p_5xl,
    paddingBottom: Padding.p_base,
    paddingHorizontal: Padding.p_base,
    overflow: "hidden",
    marginBottom: 300
  },
  passwordSecurityEdit: {
    flex: 1,
    backgroundColor: Color.colorWhitesmoke_200,
  }, BtnContainer: {
    backgroundColor: colors.sparklight_purple_blue,
    justifyContent: "center",
  },
  Btn: {
    color: colors.snow_white,
    fontFamily: FontFamily.openSansRegular,
    textAlign: "center",
    padding: 16,
    fontSize: 16,
  },
});

export default PasswordSecurityEdit;
