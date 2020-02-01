import {readFileSync, writeFile} from 'fs';

import {
    getSettings,
    updateSetting
} from './settings';
jest.mock('fs');

test('Getting the current settings should return current settings value', () => {
    const expectedSettings = {
        someValue: {
            someOtherValue: "some stuff here"
        }
    };

    readFileSync.mockReturnValue(JSON.stringify(expectedSettings));

    const actualSettings = getSettings();

    expect(actualSettings).toMatchObject(expectedSettings);
});

test('Updating a value in the settings should only change that value', () => {
    const initialSettings = {
        someValue: {
            someOtherValue: "some stuff here"
        }
    };

    const testKey = 'someNewValue';
    const testValue = 'some value here';
    const expectedSettings = {
        ...initialSettings,
        [testKey]: testValue
    }

    readFileSync.mockReturnValue(JSON.stringify(initialSettings));

    updateSetting(testKey, testValue);

    const actualSettings = getSettings();

    expect(actualSettings).toMatchObject(expectedSettings);
    expect(writeFile).toHaveBeenCalledTimes(1);
});

test('Updating a value runs the provided callback', () => {
    const initialSettings = {
        someValue: {
            someOtherValue: "some stuff here"
        }
    };

    const testKey = 'someNewValue';
    const testValue = 'some value here';
    const testCallback = jest.fn();

    readFileSync.mockReturnValue(JSON.stringify(initialSettings));
    writeFile.mockImplementation((key, value, callback) => {callback()});

    updateSetting(testKey, testValue, testCallback);
    expect(testCallback).toHaveBeenCalledTimes(1);
});
