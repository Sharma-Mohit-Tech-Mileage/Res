import React, { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  Pressable,
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
import { useNavigation } from "@react-navigation/native";
import { GetApiRequest } from "../../../network/APIClient";
import { getUser } from "../../../redux/utils/LocalStorage";
import PasswordKey from "../../../res/svgIcons/passwordKey";
import TicketListIcon from "../../../res/svgIcons/TicketListIcon";
const SupportTicket = () => {
  const navigation = useNavigation();
  const [ticketList, setTicketList] = useState([]);
  const [loading, setLoading] = useState(false);

  const getTicketList = () => {
    setLoading(true);
    let re = getUser().then((res) => {
      const request = `support/api/tickets/account/${res.userInfo.accountNumber}/created_at/asc/1/100`;
      GetApiRequest(
        request,
        (res) => {
          console.log("getTicketList", res);
          if (res) {
            setTicketList(res);
          }
          setLoading(false);
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

  const RenderNoTicket = () => {
    return (
      <View style={styles.frameWrapper}>
        <View style={styles.frameBorder}>
          <View style={styles.frameView}>
            <View style={styles.featuredIconParent}>
              <View style={styles.featuredIconLayout}>
               <TicketListIcon isGrey={true}/>
              </View>
              <Text style={[styles.noTicketsCreated, styles.createATicketTypo]}>
                No Tickets Created
              </Text>
              <Text style={[styles.createATicket, styles.createATicketTypo]}>
                Create a ticket to receive support
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const RenderTicketList = ({ item }) => {
    return (
      <View
        style={{
          flexDirection: "column",
          borderColor: Color.Gray300,
          borderWidth: 1,
          marginHorizontal: Padding.p_base,
          marginBottom: Padding.p_5xl,
        }}
      >
        <Pressable
          style={styles.ticketParent}
          onPress={() => {
            navigation.navigate("ViewTicket", { ticketId: item.ticketNumber });
          }}
        >
          <View
            style={{ paddingHorizontal: Padding.p_base, flexDirection: "row" }}
          >
            <TicketListIcon/>
            <Text style={{ fontFamily: FontFamily.interBold, fontSize: 14,textAlignVertical:'center' }}>
              {" "}
              Ticket #{item.ticketNumber}{" "}
            </Text>
          </View>
          <Image
            style={styles.chevronIconLayout}
            resizeMode="stretch"
            source={require("../../../../assets/chevronright.png")}
          />
        </Pressable>
        <View
          style={{
            flexDirection: "column",
            paddingHorizontal: Padding.p_5xl,
            marginTop: 10,
          }}
        >
          <Text style={styles.issueType}>Status</Text>
          <View style={{ alignSelf: "flex-start", padding: 0 }}>
            <Text
              style={[
                styles.text,
                styles.textTypo,
                styles.badge,
                styles.badgeBorder,
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
            <Text style={styles.billingTypo}>{item.category}</Text>
          </View>

          <View style={{ marginTop: 10 }}>
            <Text style={styles.issueType}>Issue Description</Text>
            <Text style={styles.billingTypo}>{item.description}</Text>
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
          {ticketList.length > 0 ? (
            <View style={{ height: "85%" }}>
              <FlatList
                data={ticketList}
                keyExtractor={(item, index) => index.toString()}
                renderItem={RenderTicketList}

                //onEndReached={onEndReached}
                //onEndReachedThreshold={0.1}
                //ListFooterComponent={Footer}
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
    paddingBottom: Padding.p_5xl,
    paddingTop: Padding.p_base,
  },
  frameParent: {
    // flex: 1,
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
  badge: {
    backgroundColor: Color.success50,
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
    marginTop: 10,
  },
});

export default SupportTicket;
