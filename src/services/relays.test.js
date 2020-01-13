import {
    updateRelays,
    getRelayState
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

    test('Setting relays should change the relay states', () => {
        const newState = {
            firstFloorRelayState: '0000',
            secondFloorRelayState: '0000',
            alarmOverride: true
        };
        const callback = jest.fn();

        updateRelays(newState, callback);

        expect(Relay.mock.instances[1].setRelays).toHaveBeenCalledWith(newState.firstFloorRelayState);
        expect(Relay.mock.instances[0].setRelays).toHaveBeenCalledwith(newState.secondFloorRelayState);
    });

    describe('and alarm is overriding the relays', () => {
        let expectedSettings;

        beforeEach(() => {
            const getSettingsSpy = jest.spyOn(settings, 'getSettings');

            expectedSettings = {
                relays: {
                    firstFloorRelayState: '3333',
                    secondFloorRelayState: '4444',
                    alarmOverride: false
                }
            };

            getSettingsSpy.mockReturnValue(expectedSettings)
        })
        test('Setting second floor relays should change the relay state and run the callback', () => {
            const newState = {
                firstFloorRelayState: '0000',
                secondFloorRelayState: '0000',
                alarmOverride: true
            };
            const callback = jest.fn();
            const updateSettingSpy = jest.spyOn(settings, 'updateSetting');

            updateRelays(newState, callback);

            const expectedState = {
                ...expectedSettings.relays,
                alarmOverride: true
            }

            expect(updateSettingSpy).toHaveBeenCalledWith('relays', expectedState, callback);
        });
    });

    describe('and frontend is setting the relays', () => {
        test('Setting second floor relays should change the relay state and run the callback', () => {
            const newState = {
                firstFloorRelayState: '0000',
                secondFloorRelayState: '0000',
                alarmOverride: false
            };
            const callback = jest.fn();
            const updateSettingSpy = jest.spyOn(settings, 'updateSetting');

            updateRelays(newState, callback);

            expect(updateSettingSpy).toHaveBeenCalledWith('relays', newState, callback);
        });
    });

    test('Get Relay State should return the current state of the relays', () => {
        const expectedRelays = {
            firstFloorRelayState: 'foo',
            secondFloorRelayState: 'bar',
            alarmOverride: false
        };

        const mockSettingState = {
            relays: {
                firstFloorRelayState: expectedRelays.firstFloorRelayState,
                secondFloorRelayState: expectedRelays.secondFloorRelayState,
                alarmOverride: expectedRelays.alarmOverride
            }
        };

        const getSettingsSpy = jest.spyOn(settings, 'getSettings');
        getSettingsSpy.mockReturnValue(mockSettingState);

        const actualRelays = getRelayState();

        expect(actualRelays.firstFloorRelayState).toStrictEqual(expectedRelays.firstFloorRelayState);
        expect(actualRelays.secondFloorRelayState).toStrictEqual(expectedRelays.secondFloorRelayState);
        expect(actualRelays.alarmOverride).toStrictEqual(expectedRelays.alarmOverride);
    });
});
