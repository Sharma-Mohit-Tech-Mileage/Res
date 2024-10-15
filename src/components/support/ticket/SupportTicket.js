import React, { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  Pressable,
  Platform,
  RefreshControl,
} from "react-native";
import {
  Padding,
  FontFamily,
  FontSize,
  Color,
  Border,
} from "../../../../GlobalStyles";
import ProfileSettingsHeader from "../../common/ProfileSettingsHeader";
import SparkLightButton from "../../common/customui/SparkLightButton";
import { useNavigation ,useIsFocused} from "@react-navigation/native";
import { GetApiRequest } from "../../../network/APIClient";
import { getUser, getPendingTicket } from "../../../redux/utils/LocalStorage";
import TicketListIcon from "../../../res/svgIcons/TicketListIcon";
import SparkLightInput from "../../common/customui/SparkLightInput";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

const SupportTicket = () => {
  const navigation = useNavigation();
  const [ticketList, setTicketList] = useState([]);
  const [mainList, setMainList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTxt, setSearchTxt] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const isFocused = useIsFocused();

  const onRefresh = () => {
    setRefreshing(true);

    setTimeout(() => {
      //setRefreshing(false);
      getTicketList();
    }, 500);
  };
  const getTicketList = () => {
    setLoading(true);
    let re = getUser().then((res) => {
      const request = `support/api/tickets/account/${res.userInfo.accountNumber}/created_at/dsc/1/100`;
      GetApiRequest(
        request,
        (res) => {
          console.log("getTicketList", res);
          if (res) {
            setTicketList(res);
            setMainList(res);
            getPendingTicket().then((data) => {
              // let pendingList=[]
              if (res.length > 0 && data) {
                if (
                  res.filter((item) => item.ticketNumber == data.ticketNumber)
                    .length == 0
                ) {
                  res.unshift(data);
                }
              }

              setTicketList(res);
              setMainList(res);
            });
          }else{
            getPendingTicket().then((data) => {
              if(data){   
              setTicketList(data);
              setMainList(data);
              }
            });
          }
          setLoading(false);
          setRefreshing(false);
        },
        (error) => {
          setLoading(false);
          console.log(error);
        }
      );
    });
  };

  useEffect(() => {
    getTicketList();
  }, []);

  useEffect(() => {
    isFocused && getTicketList()
  },[isFocused]);

  const capitalizeFirstLetter = (string) => {
    return (
      string != undefined && string.charAt(0).toUpperCase() + string.slice(1)
    );
  };

  const RenderNoTicket = () => {
    return (
      <View style={styles.frameWrapper}>
        <View style={styles.frameBorder}>
          <View style={styles.frameView}>
            <View style={styles.featuredIconParent}>
              <View style={styles.featuredIconLayout}>
                <TicketListIcon isGrey={true} />
              </View>
              <Text style={[styles.noTicketsCreated, styles.createATicketTypo]}>
                {searchTxt.length > 0 && ticketList.length == 0
                  ? "No Results found"
                  : "No Tickets Created"}
              </Text>
              <Text style={[styles.createATicket, styles.createATicketTypo]}>
                {searchTxt.length > 0 && ticketList.length == 0
                  ? " "
                  : "Create a ticket to receive support"}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const getStatusColor = (status) => {
    let color = "#067647";
    switch (status) {
      case "new":
        color = "#F88700";
        break;
      case "open":
        color = "#EF4E3E";
        break;
      case "pending":
        color = "#8D3B90";
        break;
      case "solved":
        color = "#067647";
        break;
      case "closed":
        color = "#067647";
        break;
      default:
        color = "#F88700";
    }
    return color;
  };

  const RenderTicketList = ({ item,index }) => {
    return (
      <View
        key={item.id}
        style={{
          flexDirection: "column",
          borderColor: Color.Gray300,
          borderWidth: 1,
          marginHorizontal: Padding.p_base,
          //marginBottom: Padding.p_5xl,
          marginBottom:(ticketList.length-1==index) ? 200:Padding.p_5xl
        }}
      >
        <Pressable
          style={styles.ticketParent}
          onPress={() => {
            if(!item?.isLocal){
            navigation.navigate("ViewTicket", { ticketId: item.ticketNumber });
            }
          }}
        >
          <View
            style={{ paddingHorizontal: Padding.p_base, flexDirection: "row" }}
          >
            <View 
              accessibilityLabel="View Ticket Details"
              accessibilityRole="button"
              >
            <TicketListIcon />
            </View>
            

            <Text
              style={{
                fontFamily: FontFamily.interBold,
                fontSize: 14,
                textAlignVertical: "center",
                color: Color.sparklightGray1,
              }}
              
            >
              {" "}
              Ticket #{item.ticketNumber}{" "}
            </Text>
          </View>
          { !item?.isLocal && (
          <Image
            style={styles.chevronIconLayout}
            resizeMode="stretch"
            source={require("../../../../assets/chevronright.png")}
          />
          )}
        </Pressable>
        <View
          style={{
            flexDirection: "column",
            paddingHorizontal: Padding.p_5xl,
            marginTop: 10,
          }}
        >
          <Text style={styles.issueType}>Status</Text>
          <View
            style={{
              alignSelf: "flex-start",
              borderRadius: 2,
              padding: 0,
              backgroundColor: getStatusColor(item?.status.toLowerCase()),
            }}
          >
            <Text
              style={[
                styles.text,
                styles.textTypo,
                styles.badge,
                { color: "#FFF" },
              ]}
            >
              {item.status}
            </Text>
          </View>

          <View
            style={{
              justifyContent: "center",
              alignSelf: "stretch",
              marginTop: 10,
            }}
          >
            <Text style={styles.issueType}>Issue Type</Text>
            <Text style={styles.billingTypo}>
              {capitalizeFirstLetter(item?.category)}
            </Text>
          </View>

          <View style={{ marginTop: 10 }}>
            <Text style={styles.issueType}>Subject</Text>
            <Text style={styles.billingTypo}>{item.subject}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.ticketSupportNone}>
      <ProfileSettingsHeader
        title="Ticket Support"
        onPressBack={() => navigation.navigate("support")}
      />
      <View style={styles.frameParent}>
        <View style={[styles.frameGroup, styles.frameGroupSpaceBlock]}>
          <View style={styles.ticketsParent}>
            <Text style={styles.tickets}>Tickets</Text>
            <SparkLightButton
              onPress={() => navigation.navigate("CreateTicket")}
              buttonText="Create Ticket"
            />
          </View>
          <View style={{ marginHorizontal: 16, marginBottom: 10 }}>
            <SparkLightInput
              placeholder={"Search by Ticket # or Subject"}
              onChangeText={(text) => {
                setSearchTxt(text);
                console.log(":", text);
                if (text.length > 0) {
                  const newData1 = mainList.filter((item) => {
                    //console.log('test=',item.subject)
                    if (item.ticketNumber.toString().includes(text)) {
                      return true;
                    } else if (
                      item.subject.toLowerCase().includes(text.toLowerCase())
                    ) {
                      return true;
                    } else {
                      return false;
                    }
                  });
                  setTicketList(newData1);
                } else {
                  setTicketList(mainList);
                }
              }}
              value={searchTxt}
            />
            <Text
              style={[
                styles.supportingTypo1,
                {
                  marginTop: 10,
                  color: Color.sparklightaddGray,
                  fontFamily: FontFamily.openSansRegular,
                  alignSelf: "stretch",
                },
              ]}
            >
              New tickets may take up to 15 minutes to appear. If not, please submit a new ticket or contact support via chat.
            </Text>
          </View>
          {ticketList.length > 0 ? (
            <View style={{ paddingBottom: hp('50%'), flexDirection:'column' }}>
              <FlatList
                data={ticketList}
                keyExtractor={(item, index) => index.toString()}
                renderItem={(item,index)=>RenderTicketList(item,index)}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
                //onEndReached={onEndReached}
                //onEndReachedThreshold={0.1}
                //ListFooterComponent={<></>}
              />
            </View>
          ) : loading ? (
            <ActivityIndicator
              size="small"
              color="#8D3B90"
              style={[styles.activityIndicator]}
            />
          ) : (
            <RenderNoTicket />
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  ticketSupportNone: {
    backgroundColor: Color.colorWhitesmoke_200,
    width: "100%",
    flex: 1,
    overflow: "hidden",
  },
  frameGroupSpaceBlock: {
    paddingBottom: Padding.p_5xs,
    paddingTop: Padding.p_base,
  },
  frameParent: {
    flex: 1,
    paddingHorizontal: Padding.p_base,
    paddingVertical: Padding.p_5xl,
  },
  frameGroup: {
    //flex: 1,
    borderColor: Color.sparklightGray1,
    borderRadius: Border.br_11xs,
    backgroundColor: Color.sparklightWhite,
    overflow: "hidden",
  },
  ticketsParent: {
    flexDirection: "row",
    alignItems: "space-between",
    paddingHorizontal: Padding.p_5xl,
    paddingBottom: Padding.p_5xl,
    width: "100%",
  },
  tickets: {
    flex: 1,
    fontSize: FontSize.size_3xl,
    color: Color.sparklightGray1,
    fontFamily: FontFamily.openSansRegular,
  },
  featuredIcon: {
    borderRadius: 24,
  },
  featuredIconLayout: {
    width: 48, // Width as per Figma design
    height: 48, // Height as per Figma design
    borderRadius: 24, // This will make it a circle
    padding: 12, // Padding as per Figma design
    justifyContent: "center", // Center content vertically
    alignItems: "center", // Center content horizontally
    borderColor: "#F4F4F5", // Border color from Figma design
    borderWidth: 8, // Border width from Figma design (calculated based on Figma properties)
    backgroundColor: "#F4F4F5", // Background color from Figma design
  },
  createATicketTypo: {
    textAlign: "center",
    fontFamily: FontFamily.openSansRegular,
    lineHeight: 28,
    marginTop: 8,
  },
  noTicketsCreated: {
    fontSize: FontSize.size_base,
    color: Color.sparklightGray1,
  },
  createATicket: {
    color: Color.sparklightDarkGray,
    fontSize: FontSize.size_sm,
  },
  featuredIconParent: {
    justifyContent: "center",
    alignItems: "center",
  },
  frameView: {
    paddingVertical: 48,
    justifyContent: "center",
    paddingHorizontal: Padding.p_5xl,
  },
  frameBorder: {
    borderWidth: 1,
    borderColor: Color.sparklightGray,
    borderRadius: Border.br_11xs,
  },
  frameWrapper: {
    paddingHorizontal: Padding.p_base,
  },
  frameChild: {
    marginTop: 10,
    borderRadius: Border.br_11xs,
    height: 24,
  },
  ticketParent: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: Color.Gray300,
    paddingVertical: Padding.p_base,
  },
  chevronIconLayout: {
    marginRight: 8,
    height: 20,
    width: 20,
    overflow: "hidden",
  },
  issueType: {
    fontSize: FontSize.size_sm,
    textAlign: "left",
    color: Color.colorGray_100,
    lineHeight: 28,
    fontFamily: FontFamily.openSansSemiBold,
    fontWeight: "600",
  },
  billingTypo: {
    fontSize: FontSize.size_base,
    textAlign: "left",
    color: Color.sparklightGray1,
    fontFamily: FontFamily.openSansRegular,
    lineHeight: 28,
  },
  supportingTypo1: {
    lineHeight: 20,
    fontSize: FontSize.textXsSemibold_size,
    textAlign: "left",
  },
  badge: {
    borderColor: Color.colorAquamarine,
    paddingHorizontal: Padding.p_5xs,
    paddingVertical: Padding.p_11xs,
  },
  textTypo: {
    fontSize: FontSize.textXsSemibold_size,
    textAlign: "center",
    fontWeight: "600",
    lineHeight: 18,
  },
  text: {
    color: Color.success700,
    fontFamily: FontFamily.openSansSemiBold,
  },
  badgeBorder: {
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: Border.br_11xs,
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: "center",
  },
  activityIndicator: {
    transform: [{ scale: 2 }],
    marginVertical: 10,
    paddingVertical: 5,
  },
});

export default SupportTicket;
