import {
    Dimensions,
    StyleSheet
} from 'react-native';

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

// Splash page screen
const splashPageStyels = StyleSheet.create({
    container:
    {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    logo_image: {
        resizeMode: "contain",
        height: 120,
        width: 200,
    }
})
// Login page styles
const loginPageStyles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white',
    },
    svg_bell_icons: {
        resizeMode: "contain",
        height: 20,
        width: 20,
        marginRight: 15,
        tintColor: '#e0e0e0'
    },
    container_1: {
        flex: 1,
        marginTop: -56,
        flexDirection: 'column',
        backgroundColor: 'white',
    },
    top_image: {
        width: width,
        height: 220,
        resizeMode: 'cover',
    },
    content_container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'transparent',
        marginTop: - height * .1,
        alignSelf: 'center',
    },
    content_container_1: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'transparent',
        alignSelf: 'center',
    },
    logo_image: {
        resizeMode: "contain",
        height: height * .2,
        marginTop: -8,
        width: width * .4
    },
    welcome_text: {
        fontSize: 20,
        color: '#fb0f0c',
        fontWeight: '400',
        marginTop: 20,
        fontFamily: 'OpenSans-Semibold',
    },
    resend_text: {
        fontSize: 16,
        color: 'black',
        fontWeight: '400',
        marginTop: 30,
        fontFamily: 'OpenSans-Regular',
    },
    resend_btn_text: {
        fontSize: 16,
        textDecorationLine: 'underline',
        color: 'black',
        fontWeight: '400',
        marginTop: 30,
        fontFamily: 'OpenSans-Regular',
    },
    edit_bg: {
        borderWidth: .5,
        width: width * .8,
        padding: 5,
        color: '#e0e0e0',
        marginTop: 30,
        flexDirection: 'row',
        alignItems: 'center'
    },
    edit_type_bg: {
        borderWidth: .5,
        padding: 5,
        marginLeft: 10,
        marginRight: 10,
        color: '#e0e0e0',
        marginTop: 15,
        flexDirection: 'row',
        alignItems: 'center'
    },
    svg_icons: {
        resizeMode: "contain",
        height: 20,
        width: 20,
        tintColor: '#e0e0e0',
    },
    svg_icon_delete: {
        resizeMode: "contain",
        height: 20,
        width: 20,
        marginLeft: 20,
        tintColor: '#fb0f0c',
    },
    svg_icons_1: {
        resizeMode: "contain",
        height: 20,
        width: 20,
        tintColor: '#000000',
    },
    svg_bell_icons: {
        resizeMode: "contain",
        height: 20,
        width: 20,
        marginRight: 15,
        tintColor: '#e0e0e0'
    },
    svg_icons_close: {
        height: 28,
        width: 28,
        tintColor: '#ffffff'
    },
    input: {
        height: 40,
        width: '90%',
        marginLeft: 8,
        marginRight: 20,
        color: 'black',
        fontFamily: 'OpenSans-Regular'
    },
    input_password: {
        height: 40,
        width: '75%',
        marginLeft: 8,
        marginRight: 20,
        color: 'black',
        fontFamily: 'OpenSans-Regular',
    },
    btn: {
        height: 45,
        width: width * .8,
        backgroundColor: '#fb0f0c',
        marginTop: 30,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btn_login: {
        height: 35,
        margin: 8,
        width: width * .4,
        backgroundColor: '#fb0f0c',
        marginTop: 20,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btn_login_1: {
        margin: 8,
        borderWidth: .5,
        width: width * .4,
        borderRadius: 50,
        marginBottom: 20,
        height: 35,
        alignContent: 'center',
        borderColor: '#fb0f0c',
        padding: 5,
        color: '#fb0f0c',
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    btn_admin_login: {
        marginRight: 4,
        borderWidth: .5,
        width: width * .4,
        borderRadius: 50,
        marginBottom: 20,
        height: 30,
        alignContent: 'center',
        borderColor: '#fb0f0c',
        padding: 5,
        color: '#fb0f0c',
        marginTop: 30,
        flexDirection: 'row',
        alignItems: 'center'
    },
    btn_admin_login_1: {
        marginLeft: 4,
        borderWidth: .5,
        width: width * .4,
        borderRadius: 50,
        marginBottom: 20,
        height: 30,
        alignContent: 'center',
        borderColor: '#fb0f0c',
        padding: 5,
        color: '#fb0f0c',
        marginTop: 30,
        flexDirection: 'row',
        alignItems: 'center'
    },
    photo_btn: {
        height: 45,
        width: width * .8,
        backgroundColor: '#fb0f0c',
        justifyContent: 'center',
        alignItems: 'center',
    },
    btn_ok_image: {
        height: 45,
        width: width * .7,
        marginTop: 4,
        marginBottom: 10,
        alignSelf: 'center',
        backgroundColor: '#fb0f0c',
        borderRadius: 50,
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center'
    },
    btn_text: {
        fontSize: 16,
        color: 'white',
        fontFamily: 'OpenSans-Regular'
    },
    btn_text_admin_login: {
        fontSize: 12,
        width: width * .4,
        textAlign: 'center',
        color: '#fb0f0c',
        fontFamily: 'OpenSans-Regular',
    },
    btn_activity_log: {
        fontSize: 10,
        color: 'white',
        fontFamily: 'OpenSans-Regular',
    },
    forgot_text: {
        fontSize: 14,
        marginTop: 30,
        color: 'black',
        marginBottom: 10,
        textDecorationLine: 'underline',
        fontFamily: 'OpenSans-Regular',
    }
})
// Employee forgot password page styles
const employeesForgotPasswordPageStyles = StyleSheet.create({
    btn_container: {
        flex: 1,
        height: height * .6,
        flexDirection: 'column',
        backgroundColor: 'white',
        alignItems: 'center'
    },
    edit_bg: {
        borderWidth: .5,
        width: width * .8,
        padding: 5,
        color: '#e0e0e0',
        marginTop: 50,
        flexDirection: 'row',
        alignItems: 'center'
    },
    btn: {
        height: 45,
        width: width * .8,
        backgroundColor: '#fb0f0c',
        marginTop: 30,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    add_more_btn: {
        height: 45,
        width: width * .4,
        backgroundColor: '#fb0f0c',
        marginBottom: 20,
        marginLeft: 4,
        marginRight: 4,
        marginTop: -10,
        alignSelf: 'center',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    back_btn: {
        resizeMode: "contain",
        height: 25,
        padding: 10,
        width: 25,
        margin: 20,
        position: 'absolute',
    },
    back_btn_layout: {
        marginTop: 20,
        position: 'absolute',
    },
    back_btn_layout_1: {
        marginTop: 20,
        position: 'absolute',
        marginLeft: 10
    },
    top_image_layer: {
        width: width,
        height: 220,
        backgroundColor: '#00000090',
        position: 'absolute'
    },
})
// Employee Verify OTP
const employeesVerifyOTPPageStyles = StyleSheet.create({
    input: {
        height: 40,
        width: '90%',
        marginLeft: 8,
        marginRight: 20,
        color: 'black',
        justifyContent: 'center',
        fontFamily: 'OpenSans-Regular',
    },
})
const employeesResetPageStyles = ({
    text: {
        fontSize: 12,
        color: 'gray',
        fontWeight: '400',
        marginTop: 30,
        width: width * .7,
        textAlign: 'center',
        fontFamily: 'OpenSans-Regular',
    },
})
// Employee Home page styles
const employeesHomePageStyles = StyleSheet.create({
    btn_container: {
        flex: 1,
        height: height * .6,
        flexDirection: 'column',
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: height * .1,
    },
    btn_container_1: {
        flex: 1,
        height: height * .8,
        flexDirection: 'column',
        backgroundColor: 'white',
        marginTop: height * .2,
    },
    btn_container_home: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white',
    },
    clock_btn: {
        borderWidth: .5,
        width: width * .8,
        padding: 5,
        color: '#e0e0e0',
        height: 40,
        marginTop: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    btn_text: {
        fontSize: 16,
        color: 'black',
        fontFamily: 'OpenSans-Regular',
    },
})
// Clock In page styles
const clockInPageStyles = StyleSheet.create({
    top_image_layer: {
        width: width,
        height: 140,
        backgroundColor: '#00000090',
        position: 'absolute'
    },
    top_image_layer_login_nonbabs: {
        width: width,
        height: 220,
        backgroundColor: '#00000090',
        position: 'absolute'
    },
    back_btn: {
        resizeMode: "contain",
        height: 25,
        padding: 10,
        width: 25,
        margin: 20,
    },
    back_text:
    {
        color: 'white',
        fontSize: 18,
        fontFamily: 'OpenSans-Regular',
    },
    back_view:
    {
        position: 'absolute',
        flexDirection: 'row',
        alignItems: 'center',
    },
    content_container: {
        flex: 1,
        width: width,
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'transparent',
        position: 'absolute',
        marginTop: 150,
        alignSelf: 'center',
    },
    edit_bg: {
        borderWidth: .5,
        width: width * .8,
        padding: 5,
        color: '#e0e0e0',
        marginTop: 30,
        flexDirection: 'row',
        alignItems: 'center'
    },
    btn_container: {
        flex: 1,
        width: width,
        height: height * .8,
        flexDirection: 'column',
        backgroundColor: 'white',
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
        width: width * .8,
        marginBottom: -25,
        color: 'gray',
        marginTop: 20,
        fontFamily: 'OpenSans-Regular',
    }
})
// Home page styles
const homePageStyles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000'
    },
    image: {
        marginTop: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
})
// Upload Documents page styles
const EmployeesUploadDocumentsPageStyles = ({
    content_container: {
        flex: 1,
        width: width,
        height: height + 80,
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'transparent',
        alignSelf: 'center',
    },
    top_image: {
        width: width,
        height: 140,
        resizeMode: 'cover',
    },
    top_image_nonbabas: {
        width: width,
        height: 60,
        resizeMode: 'cover',
    },
    container: {
        backgroundColor: '#ffebeb',
        width: width * .8,
        height: 200,
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    upload_text: {
        fontSize: 16,
        fontFamily: 'OpenSans-Regular',
    },
    circle: {
        height: 40,
        width: 40,
        borderRadius: 50,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20
    },
    circle_badge: {
        height: 15,
        width: 15,
        borderRadius: 15,
        backgroundColor: '#fb0f0c',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -5,
        marginLeft: -25,
        position: 'relative'
    },
    circle_upload_image: {
        height: 40,
        width: 40,
        position: 'absolute',
        borderRadius: 50,
        alignSelf: 'flex-end',
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
    },
    upload_btn: {
        height: 20,
        padding: 10,
        width: 20,
        tintColor: 'black'
    },
    file_name_text: {
        fontSize: 12,
        textDecorationLine: 'underline',
        marginRight: 5,
        fontFamily: 'OpenSans-Regular',
    },
    btn: {
        height: 45,
        width: width * .4,
        backgroundColor: 'white',
        borderRadius: 50,
        marginTop: -22.5,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#e0e0e0',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5
    },
    btn_text: {
        fontSize: 16,
        color: 'gray',
        marginLeft: 5,
        fontFamily: 'OpenSans-Regular',
    },
    btn_container: {
        flexDirection: 'row'
    },
    camera_btn: {
        height: 20,
        padding: 10,
        width: 20,
        tintColor: '#fb0f0c'
    },
    dropdown: {
        borderWidth: .5,
        width: width * .8,
        color: '#e0e0e0',
        marginTop: 20,
    },
    dropdown_filter: {
        borderWidth: .5,
        width: width * .9,
        color: '#e0e0e0',
        marginTop: 20,
    },
    drop_1: {
        width: width * .5,
        height: 140,
        padding: 6,
        marginTop: 10,
        marginLeft: 0,
        shadowColor: '#e0e0e0',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5
    },
    drop_2: {
        width: '41%',
        height: 100,
        marginTop: 6,
        shadowColor: '#e0e0e0',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5
    },
    drop_1_filter: {
        width: width * .9,
        height: 100,
        marginTop: 12,
        shadowColor: '#e0e0e0',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5
    },
    drop_container:
    {
        height: 40,
        alignItems: 'center',
        flexDirection: 'row'
    },
    drop_container_1:
    {
        height: 40,
        width: '100%',
        alignItems: 'center',
        flexDirection: 'row'
    },
    drop_text:
    {
        fontWeight: 'normal',
        textAlign: 'right',
        color: 'gray',
        marginLeft: 10,
        fontFamily: 'OpenSans-Regular',
    },
    drop_icon:
    {
        position: "absolute",
        right: 10,
        top: 10
    },
    location_container:
    {
        flexDirection: 'row',
        width: width * .8,
        marginTop: -15
    },
    edit_shop: {
        borderWidth: .5,
        width: width * .4,
        padding: 5,
        color: '#e0e0e0',
        marginTop: 30,
        marginRight: 2,
        flexDirection: 'row',
        alignItems: 'center'
    },
    edit_location: {
        borderWidth: .5,
        width: width * .4,
        padding: 5,
        marginLeft: 2,
        color: '#e0e0e0',
        marginTop: 30,
        flexDirection: 'row',
        alignItems: 'center'
    },
    edit_remark: {
        borderWidth: .5,
        width: width * .8,
        color: '#e0e0e0',
        marginTop: 15,
        flexDirection: 'row',
    },
    input: {
        width: '90%',
        marginLeft: 8,
        marginRight: 20,
        color: 'black',
        minHeight: 60,
        fontFamily: 'OpenSans-Regular',
    },
    btn_upload: {
        height: 45,
        width: width * .8,
        backgroundColor: '#fb0f0c',
        marginTop: 30,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20
    },
    btn_upload_filter: {
        height: 45,
        width: width * .9,
        backgroundColor: '#fb0f0c',
        marginTop: 25,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20
    },
    btn_activity_log: {
        height: 30,
        width: width * .4,
        backgroundColor: '#fb0f0c',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
})
// Success message page styles
const employeesSuccessMessagePageStyles = ({
    btn_container: {
        flex: 1,
        height: height,
        flexDirection: 'column',
        backgroundColor: 'white',
        alignItems: 'center',
        marginTop: height * .1,
    },
    content_container: {
        flex: 1,
        width: width,
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'white',
        alignSelf: 'center',
    },
    back_view:
    {
        position: 'absolute',
        flexDirection: 'row',
        margin: 20,
        alignItems: 'center'
    },
    circle: {
        height: 110,
        width: 110,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 80,
        marginTop: 25,
        position: 'absolute',
        shadowColor: '#e0e0e0',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
    circle_1: {
        height: 70,
        width: 70,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 80,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        marginTop: 20,
        shadowColor: '#e0e0e0',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5
    },
    circle_2: {
        height: 40,
        width: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
        borderRadius: 80,
        borderWidth: 1,
        borderColor: 'black',
        marginTop: 5,
        marginRight: 5,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5
    },
    circle_1_filter: {
        height: 70,
        width: 70,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 80,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        shadowColor: '#e0e0e0',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5
    },
    hand_btn: {
        height: 80,
        padding: 10,
        width: 80,
        margin: 20,
        tintColor: '#0dbc50',
    },
    hand_rejected_btn: {
        height: 80,
        padding: 10,
        width: 80,
        margin: 20,
        tintColor: '#fb0f0c',
        transform: [{ rotateX: '180deg' }]
    },
    container: {
        backgroundColor: '#eaf6eb',
        width: width * .9,
        height: 240,
        marginTop: height * .1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    rejected_container: {
        backgroundColor: '#ffd0d0',
        width: width * .9,
        height: 240,
        marginTop: height * .1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    bottom_view:
    {
        width: width * .6,
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    bottom_view_1:
    {
        width: width * .6,
        marginTop: -25,
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    bottom_btns: {
        height: 35,
        padding: 10,
        width: 35,
        margin: 20,
        tintColor: '#fb0f0c'
    },
})
// History page styles
const historyPageStyles = ({

    content_container: {
        flex: 1,
        height: height * .8,
        width: width,
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'transparent',
        alignSelf: 'center',
    },
    list_main_container: {
        width: width,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        marginLeft: 20,
    },
    list_main_container_1: {
        width: width,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    list_second_container: {
        width: width * .8,
        backgroundColor: '#ffebeb',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    history_list_second_container: {
        width: width * .9,
        backgroundColor: '#ffebeb',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    btn_view: {
        width: width * .1,
        marginLeft: 10,
        alignItems: 'center',
    },
    btn: {
        resizeMode: "contain",
        height: 25,
        padding: 10,
        width: 25,
        margin: 20,
        tintColor: 'gray',
    },
    circle_1: {
        height: 40,
        width: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 80,
        shadowColor: '#e0e0e0',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5
    },
    bottom_btns: {
        height: 20,
        padding: 10,
        width: 20,
        margin: 20,
        tintColor: '#fb0f0c'
    },
    bottom_btns_approved: {
        height: 20,
        padding: 10,
        width: 20,
        margin: 20,
        tintColor: '#60C347'
    },
    title_text:
    {
        marginTop: 10,
        marginLeft: 10,
        fontSize: 12,
        color: '#000000',
        fontFamily: 'OpenSans-Regular',
    },
    clock_text:
    {
        marginTop: 4,
        marginLeft: 10,
        marginBottom: 10,
        fontSize: 14,
        color: '#fb0f0c',
        fontFamily: 'OpenSans-Semibold',
    },
    noti_text:
    {
        marginTop: 4,
        marginLeft: 10,
        fontSize: 14,
        color: '#fb0f0c',
        fontFamily: 'OpenSans-SemiBold',
    },
    employee_name_text:
    {
        marginLeft: 10,
        fontSize: 12,
        marginTop: 4,
        color: '#000000',
        fontFamily: 'OpenSans-Regular',
    },
    employee_name_text_temp:
    {
        marginLeft: 10,
        width: width * .6,
        fontSize: 12,
        marginTop: 4,
        color: '#000000',
        fontFamily: 'OpenSans-Regular',
    },
    employee_name_text_temp_1:
    {
        marginLeft: 10,
        width: width * .4,
        fontSize: 12,
        marginTop: 4,
        color: '#000000',
        fontFamily: 'OpenSans-Regular',
    },
    employee_name_text_2:
    {
        width: '70%',
        marginLeft: 10,
        fontSize: 12,
        marginTop: 4,
        color: '#000000',
        fontFamily: 'OpenSans-Regular',
    },
    employee_name_text_1:
    {
        marginLeft: 10,
        fontSize: 12,
        marginTop: 4,
        color: '#000000',
        height: 16,
        fontFamily: 'OpenSans-Regular',
    },
    item_icons: {
        height: 15,
        width: 15,
        tintColor: 'gray',
    },
    item_icons_site_visit: {
        height: 15,
        width: 15,
        margin: 3,
        marginLeft: 10,
        tintColor: 'gray',
    },
    item_views:
    {
        flexDirection: 'row',
        marginLeft: 10,
        marginTop: 4,
        alignItems: 'center',
        fontFamily: 'OpenSans-Regular',
    },
    date_text:
    {
        marginTop: 10,
        marginBottom: 10,
        fontSize: 12,
        color: '#000000',
        textAlign: 'center',
        fontFamily: 'OpenSans-Regular',
    },
    status_view:
    {
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10,
        backgroundColor: 'red'
    }
})
// History details page styles
const historyDetailPageStyles = ({
    btn_container: {
        flex: 1,
        height: height,
        flexDirection: 'column',
        backgroundColor: 'white',
        marginTop: height * .1,
        alignItems: 'center',
    },
    top_image_container: {
        width: width * .8,
        height: 220,
        backgroundColor: '#ffebeb',
        justifyContent: 'center',
        borderColor: 'gray',
        borderWidth: .5
    },
    top_image: {
        width: width * .9,
        height: 420,
        marginTop: 10,
        marginBottom: 10,
        resizeMode: 'contain',
    },
    remark_text_hint: {
        fontSize: 14,
        color: 'black',
        width: width * .9,
        textDecorationLine: 'underline',
        fontFamily: 'OpenSans-Regular',
    },
    comment_text_hint: {
        fontSize: 14,
        marginTop: 10,
        color: 'black',
        width: width * .9,
        textDecorationLine: 'underline',
        fontFamily: 'OpenSans-Regular',
    },
    remark_text_hint_1: {
        fontSize: 14,
        color: 'gray',
        marginTop: 4,
        width: width * .9,
        fontFamily: 'OpenSans-Regular',
    },
    remark_text: {
        fontSize: 16,
        color: 'black',
        borderWidth: .5,
        marginTop: 20,
        padding: 10,
        height: 80,
        borderColor: 'gray',
        width: width * .8
    }
})
// Super Visor employee request
const superVisorEmployeeRequestStyles = StyleSheet.create({
    item_views:
    {
        flexDirection: 'row',
        marginLeft: 8,
        marginRight: 8,
        alignItems: 'center',
        borderColor: 'gray',
        borderWidth: .5,
        backgroundColor: '#fafafa'
    },
    item_views_top:
    {
        flexDirection: 'row',
        marginLeft: 8,
        marginRight: 8,
        alignItems: 'center',
        borderColor: 'gray',
        borderTopWidth: .5,
        borderLeftWidth: .5,
        borderRightWidth: .5,
        backgroundColor: '#fafafa'
    },
    item_views_bottom:
    {
        flexDirection: 'row',
        marginLeft: 8,
        marginRight: 8,
        alignItems: 'center',
        borderColor: 'gray',
        borderBottomWidth: .5,
        borderLeftWidth: .5,
        borderRightWidth: .5,
        backgroundColor: '#fafafa'
    },
    image_bg:
    {
        flexDirection: 'row',
        backgroundColor: '#f3f3f3'
    },
    right_line:
    {
        backgroundColor: 'gray',
        width: .5,
        height: 24,
        marginLeft: 5
    },
    employee_name_text:
    {
        marginLeft: 10,
        fontSize: 12,
        color: '#000000',
        fontFamily: 'OpenSans-Regular',
    },
    employee_name_text_3:
    {
        width: '85%',
        marginLeft: 10,
        fontSize: 12,
        color: '#000000',
        fontFamily: 'OpenSans-Regular',
    },
    remarks_text:
    {
        fontSize: 12,
        color: 'gray',
        margin: 8,
        fontFamily: 'OpenSans-Regular',
    },
    clock_text:
    {
        fontSize: 14,
        color: '#fb0f0c',
        fontFamily: 'OpenSans-Regular',
    },
    remarks_heading:
    {
        textDecorationLine: 'underline',
        color: 'black',
        fontSize: 14,
        marginLeft: 8,
        marginTop: 8,
        marginBottom: -4,
        fontFamily: 'OpenSans-Regular',
    },
    id_date_view:
    {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 8,
        marginRight: 8
    },
    list_contain:
    {
        width: width * .9,
        borderWidth: .5,
        borderColor: 'gray',
    },
    top_view:
    {
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'row',
        width: '100%'
    },
    text_id:
    {
        fontSize: 12,
        color: '#fb0f0c',
    },
    text_clock:
    {
        fontSize: 14,
        marginLeft: 8,
        color: '#fb0f0c',
        marginTop: 4,
        marginBottom: 4
    },
    text_datetime:
    {
        fontSize: 12,
        color: 'black',
        fontFamily: 'OpenSans-Regular',
    },
    button_content:
    {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 10,
        width: width * .9,
        fontFamily: 'OpenSans-Regular',
    },
    button_reject:
    {
        backgroundColor: '#ffebeb',
        width: '50%',
        marginLeft: -4,
        height: 40,
        justifyContent: 'center'
    },
    button_submit:
    {
        backgroundColor: '#eaf6eb',
        width: '50%',
        marginLeft: -4,
        height: 40,
        justifyContent: 'center'
    },
    button_cancel:
    {
        backgroundColor: '#EFEFEF',
        width: '50%',
        marginLeft: -4,
        height: 40,
        justifyContent: 'center'
    },
    button_accept:
    {
        backgroundColor: '#eaf6eb',
        width: '50%',
        marginRight: -4,
        height: 40,
        justifyContent: 'center'
    },
    text_reject:
    {
        fontSize: 14,
        textAlign: 'center',
        fontFamily: 'OpenSans-Regular',
    },
    text_accept:
    {
        fontSize: 14,
        padding: 8,
        textAlign: 'center',
        fontFamily: 'OpenSans-Regular',
    },
    image: {
        width: '96%',
        alignSelf: 'center',
        height: height * .4,
        resizeMode: 'contain',
        marginTop: 10,
        marginBottom: 10
    },
})
// Admin Dashboard page styles
const adminDashboardStyles = StyleSheet.create({
    circle_1: {
        height: 60,
        width: 60,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 80,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    main_container:
    {
        flexDirection: 'row',
        width: '70%',
        alignItems: 'center'
    },
    second_container:
    {
        flexDirection: 'row',
        width: '70%',
        alignItems: 'center',
        marginTop: 15
    },
    text_date:
    {
        width: '70%',
        marginLeft: 20,
        fontSize: 14,
        color: 'black',
        fontFamily: 'OpenSans-Regular',
    },
    text_numbers:
    {
        width: '15%',
        marginLeft: 20,
        fontSize: 14,
        color: 'black',
        textAlign: 'center',
        fontFamily: 'OpenSans-Regular',
    },
    text_numberof:
    {
        width: '50%',
        marginLeft: 20,
        fontSize: 14,
        color: 'black',
        fontFamily: 'OpenSans-Regular',
    }
})
// Admin Superviosr 
const adminSuperVisorMapping = StyleSheet.create({
    list_second_container: {
        width: width * .9,
        backgroundColor: '#F6F6F6',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    list_second_container_2: {
        width: width * .9,
        backgroundColor: '#F6F6F6',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    list_second_container_1: {
        width: width * .9,
        backgroundColor: '#F6F6F6',
        flexDirection: 'row',
        alignItems: 'center',
    },
    list_second_container_red: {
        width: width * .9,
        backgroundColor: '#F9E9E8',
        flexDirection: 'row',
        alignItems: 'center',
    },
    assign_to_text:
    {
        marginTop: 10,
        marginBottom: 10,
        fontSize: 12,
        color: '#ffffff',
        textAlign: 'center',
        fontFamily: 'OpenSans-Regular',
    },
    employee_name_text:
    {
        marginLeft: 10,
        fontSize: 12,
        marginTop: 4,
        marginBottom: 10,
        color: '#000000',
        fontFamily: 'OpenSans-Regular',
    },
    employee_name_temp:
    {
        marginLeft: 10,
        fontSize: 12,
        width: width * .6,
        marginTop: 4,
        marginBottom: 10,
        color: '#000000',
        fontFamily: 'OpenSans-Regular',
    },
    supervisor_comment_text:
    {
        marginLeft: 10,
        fontSize: 12,
        marginTop: 8,
        marginBottom: 10,
        color: '#000000',
        fontFamily: 'OpenSans-Regular',
    },
    title_text:
    {
        marginTop: 10,
        marginLeft: 10,
        fontSize: 14,
        height: 30,
        marginBottom: 4,
        color: '#000000',
        width: width * .5,
        fontFamily: 'OpenSans-Regular',
    },
    type_text:
    {
        marginLeft: 10,
        fontSize: 16,
        marginBottom: 4,
        fontWeight: '400',
        color: '#000000',
        width: width * .7,
        fontFamily: 'OpenSans-Regular',
    },
    type_text_1:
    {
        marginLeft: 10,
        fontSize: 14,
        marginBottom: 4,
        fontWeight: '400',
        color: '#000000',
        width: width * .7,
        fontFamily: 'OpenSans-Regular',
    },
    bottom_btns: {
        height: 20,
        padding: 10,
        width: 20,
        margin: 20,
        tintColor: 'gray',
        transform: [{ rotateY: '180deg' }]
    },
    top_image_layer: {
        width: width,
        height: 140,
        justifyContent: 'flex-end',
        padding: 15,
        backgroundColor: '#00000090',
        position: 'absolute'
    },
    top_image_layer_1: {
        width: width,
        height: 140,
        justifyContent: 'flex-end',
        padding: 15,
        position: 'absolute'
    },
    edit_bg: {
        borderWidth: .5,
        width: width * .9,
        padding: 5,
        alignSelf: 'center',
        color: '#e0e0e0',
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center'
    },
    activity_log_edit_bg: {
        borderWidth: .5,
        width: '49%',
        padding: 5,
        alignSelf: 'center',
        color: '#e0e0e0',
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    drop_container_2:
    {
        height: 40,
        width: '98%',
        alignItems: 'center',
        flexDirection: 'row'
    },
})
// Admin Delegate Details
const adminDelegateDetails = StyleSheet.create({
    delegate_text: {
        width: width * .9,
        fontSize: 14,
        color: 'gray',
        marginTop: 20,
        fontFamily: 'OpenSans-Regular',
    },
    edit_bg: {
        borderWidth: .5,
        width: width * .9,
        padding: 5,
        alignSelf: 'center',
        color: '#e0e0e0',
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center'
    },
    edit_remark: {
        borderWidth: .5,
        width: width * .9,
        color: '#e0e0e0',
        marginTop: 10,
        flexDirection: 'row',
    },
    checkbox: {
        width: width * .9,
        marginTop: 20,
        flexDirection: 'row',
    }
})
// Alert box styles
const alertStyles = StyleSheet.create({
    alertBg: {
        justifyContent: 'center',
        backgroundColor: 'white',
        padding: 2,
        borderRadius: 5,
        margin: 20,
        alignItems: 'center'
    },
    alertTitle: {
        alignSelf: 'center',
        fontSize: 14,
        fontWeight: 'bold'
    },
    alertDivider: {
        height: .5,
        backgroundColor: 'gray',
        marginTop: 10
    },
    alertText: {
        alignSelf: 'center',
        fontSize: 12,
        marginTop: 10
    },
    alertButtonsLayout: {
        width: '100%',
        marginLeft: 2,
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
    },
    alertButton: {
        fontWeight: 'bold',
        fontSize: 14
    }
})

export {
    employeesSuccessMessagePageStyles,
    splashPageStyels,
    loginPageStyles,
    homePageStyles,
    alertStyles,
    employeesHomePageStyles,
    employeesForgotPasswordPageStyles,
    employeesVerifyOTPPageStyles,
    employeesResetPageStyles,
    clockInPageStyles,
    EmployeesUploadDocumentsPageStyles,
    historyPageStyles,
    historyDetailPageStyles,
    superVisorEmployeeRequestStyles,
    adminDashboardStyles,
    adminSuperVisorMapping,
    adminDelegateDetails
};
