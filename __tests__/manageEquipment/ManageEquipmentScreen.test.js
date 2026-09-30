import React from 'react';
import renderer, {act} from 'react-test-renderer';
import ManageEquipmentScreen from '../../src/components/services/manageEquipment/ManageEquipmentScreen';
import dataUsageApi from '../../src/network/apis/services/dataUsageService';

let mockAccount = 'account-a';
jest.mock('react-redux', () => ({useSelector: selector => selector({profile: {accountDetails: {account_number: mockAccount}}})}));
jest.mock('@react-navigation/native', () => ({useFocusEffect: callback => require('react').useEffect(callback, [callback])}));
jest.mock('@react-navigation/bottom-tabs', () => ({BottomTabBarHeightContext: require('react').createContext(0)}));
jest.mock('react-native-safe-area-context', () => ({useSafeAreaInsets: () => ({bottom: 0})}));
jest.mock('../../src/network/apis/services/dataUsageService', () => ({getEquipment: jest.fn()}));
jest.mock('../../src/components/common/ProfileSettingsHeader', () => 'Header');
jest.mock('../../src/components/services/manageEquipment/MyModemCard', () => 'Modem');
jest.mock('../../src/components/services/manageEquipment/MyAddons', () => 'Addons');
jest.mock('../../src/components/services/manageEquipment/MySpeedCard', () => 'Speed');
const eero = {equipment_category: '05', manufacturer: ' Eero ', serial_number: '123'};
const navigation = {goBack: jest.fn()};
beforeEach(() => {mockAccount = 'account-a'; jest.clearAllMocks();});

it.each([
  [[eero], true],
  [[], false],
  [[{...eero, manufacturer: 'OTHER'}], false],
  [[{...eero, serial_number: '*'}], false],
  [[{...eero, equipment_category: '03'}], false],
])('gates eero UI using account equipment %j', async (equipments, supported) => {
  dataUsageApi.getEquipment.mockResolvedValue({equipments});
  let screen;
  await act(async () => {screen = renderer.create(<ManageEquipmentScreen navigation={navigation} />);});
  expect(screen.root.findAllByType('Addons')).toHaveLength(supported ? 1 : 0);
  expect(screen.root.findByType('Speed').props.hideModemSpeed).toBe(!supported);
  expect(screen.root.findByType('Speed').props.hasEeroDevice).toBe(supported);
  act(() => screen.unmount());
});

it('hides eero UI while validating and after a failed request', async () => {
  let reject;
  dataUsageApi.getEquipment.mockReturnValue(new Promise((resolve, rejectRequest) => {reject = rejectRequest;}));
  let screen;
  act(() => {screen = renderer.create(<ManageEquipmentScreen navigation={navigation} />);});
  expect(screen.root.findAllByType('Addons')).toHaveLength(0);
  await act(async () => {reject(new Error('Unavailable'));});
  expect(screen.root.findByType('Speed').props.hideModemSpeed).toBe(true);
  act(() => screen.unmount());
});

it('ignores equipment from the previous account when accounts change', async () => {
  let resolveOld;
  dataUsageApi.getEquipment.mockReturnValueOnce(new Promise(resolve => {resolveOld = resolve;})).mockResolvedValue({equipments: []});
  let screen;
  act(() => {screen = renderer.create(<ManageEquipmentScreen navigation={navigation} />);});
  mockAccount = 'account-b';
  await act(async () => {screen.update(<ManageEquipmentScreen navigation={navigation} />);});
  await act(async () => {resolveOld({equipments: [eero]});});
  expect(screen.root.findAllByType('Addons')).toHaveLength(0);
  expect(screen.root.findByType('Speed').props.hideModemSpeed).toBe(true);
  act(() => screen.unmount());
});
