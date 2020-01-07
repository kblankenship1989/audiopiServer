import {
    setFirstFloor,
    setSecondFloor,
    getRelayStates
} from './relays';
import * as settings from './settings';
import {Relay} from '../classes/Relay';
jest.mock('../classes/Relay');

describe("Relay Service => ", () => {

    test('First and second floor relays initiated with correct pins', () => {
        expect(Relay).toHaveBeenCalledTimes(2);
        expect(Relay).toHaveBeenNthCalledWith(1, 11, 9 ,10);
        expect(Relay).toHaveBeenNthCalledWith(2, 25, 8, 7);
    });

    test('Setting first floor relays should change the relay state and run the callback', () => {
        const newState = '0000';
        const callback = () => {};
        const updateSettingSpy = jest.spyOn(settings, 'updateSetting');

        setFirstFloor(newState, callback);

        expect(Relay.mock.instances[1].setRelays).toHaveBeenCalledWith(newState);
        expect(updateSettingSpy).toHaveBeenCalledWith('firstFloorRelayState', newState, callback);
    });

    test('Setting second floor relays should change the relay state and run the callback', () => {
        const newState = '0000';
        const callback = () => {};
        const updateSettingSpy = jest.spyOn(settings, 'updateSetting');

        setSecondFloor(newState, callback);

        expect(Relay.mock.instances[0].setRelays).toHaveBeenCalledWith(newState);
        expect(updateSettingSpy).toHaveBeenCalledWith('secondFloorRelayState', newState, callback);
    });

    test('Get Relay State should return the current state of the relays', () => {
        const expectedRelays = {
            firstFloor: 'foo',
            secondFloor: 'bar'
        };

        settings.settings = {
            firstFloorRelayState: expectedRelays.firstFloor,
            secondFloorRelayState: expectedRelays.secondFloor
        };

        const actualRelays = getRelayStates();

        expect(actualRelays.firstFloor).toStrictEqual(expectedRelays.firstFloor)
        expect(actualRelays.secondFloor).toStrictEqual(expectedRelays.secondFloor)
    });
});
