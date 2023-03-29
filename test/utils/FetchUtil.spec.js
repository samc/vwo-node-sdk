/**
 * Copyright 2019-2022 Wingify Software Pvt. Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @jest-environment jsdom
 */
const FetchUtil = require('../../lib/utils/FetchUtil');

describe('FetchUtil', () => {
  describe('method: send', () => {
    it('should return if no url/method is passed', () => {
      expect(FetchUtil.send()).toBeUndefined();
      expect(FetchUtil.send({ method: 'GET' })).toBeUndefined();
      expect(FetchUtil.send({ url: 'https://vwo.com' })).toBeUndefined();
      const promise = FetchUtil.send({ url: 'https://vwo.com', method: 'GET' }).catch(() => {});
      expect(typeof promise.then).toBe('function');
    });

    describe('method: _getStoredSettings', () => {
      it('should return false and no settings if userStorageService is not passed', () => {
        const data = FetchUtil._getStoredSettings();

        expect(data.isStoredData).toBe(false);
        expect(data.parsedSettings).toBe(undefined);
      });

      it('should return false and no settings if userStorageService is not valid', () => {
        const userStorageService = {};
        const data = FetchUtil._getStoredSettings(userStorageService);

        expect(data.isStoredData).toBe(false);
        expect(data.parsedSettings).toBe(undefined);
      });

      it('should return false and no settings if userStorageService returns blank object', () => {
        const userStorageService = {
          getSettings: function() {
            return {};
          }
        };
        const data = FetchUtil._getStoredSettings(userStorageService);

        expect(data.isStoredData).toBe(false);
        expect(data.parsedSettings).toEqual(undefined);
      });

      it('should return false and no settings if userStorageService returns stringified blank object', () => {
        const userStorageService = {
          getSettings: function() {
            return JSON.stringify({});
          }
        };
        const data = FetchUtil._getStoredSettings(userStorageService);

        expect(data.isStoredData).toBe(false);
        expect(data.parsedSettings).toEqual({});
      });

      it('should return false and settings if userStorageService returns invalid stringifeid data', () => {
        const settings = { accountId: 123, faultyKeys: [] };
        const userStorageService = {
          getSettings: function() {
            return JSON.stringify(settings);
          }
        };
        const data = FetchUtil._getStoredSettings(userStorageService);

        expect(data.isStoredData).toBe(false);
        expect(data.parsedSettings).toEqual(settings);
      });

      it('should return true and settings if userStorageService returns valid settings', () => {
        const settings = { accountId: 123, campaigns: [], version: 1, sdkKey: 'abc' };
        const userStorageService = {
          getSettings: function() {
            return JSON.stringify(settings);
          }
        };
        const data = FetchUtil._getStoredSettings(userStorageService);

        expect(data.isStoredData).toBe(true);
        expect(data.parsedSettings).toEqual(settings);
      });
    });
  });
});
