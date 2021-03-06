/*
 * ! ${copyright}
 */

sap.ui.define([
	"sap/ui/fl/write/_internal/Versions",
	"sap/ui/fl/Utils"
], function(
	Versions,
	Utils
) {
	"use strict";
	/**
	 * Provides an API for tools like {@link sap.ui.rta} to activate, discard and retrieve versions.
	 *
	 * @namespace sap.ui.fl.write.api.VersionsAPI
	 * @experimental Since 1.74
	 * @since 1.74
	 * @ui5-restricted sap.ui.rta, similar tools
	 *
	 */
	var VersionsAPI = /** @lends sap.ui.fl.write.api.VersionsAPI */ {};

	/**
	 * Returns a flag if a draft exists for the current application and layer.
	 *
	 * @param {object} mPropertyBag - Property Bag
	 * @param {sap.ui.fl.Selector} mPropertyBag.selector - Selector for which the request is done
	 * @param {string} mPropertyBag.layer - Layer for which the versions should be retrieved
	 *
	 * @return {Promise<boolean>} Promise resolving with a flag if a draft is available;
	 * rejects if an error occurs or the layer does not support draft handling
	 */
	VersionsAPI.isDraftAvailable = function (mPropertyBag) {
		return VersionsAPI.getVersions(mPropertyBag)
			.then(function (aVersions) {
				var oDraft = aVersions.find(function (oVersion) {
					return oVersion.versionNumber === 0;
				});

				return !!oDraft;
			});
	};

	/**
	 * Returns a list of versions.
	 *
	 * @param {object} mPropertyBag - Property Bag
	 * @param {sap.ui.fl.Selector} mPropertyBag.selector - Selector for which the request is done
	 * @param {string} mPropertyBag.layer - Layer for which the versions should be retrieved
	 *
	 * @returns {Promise<sap.ui.fl.Versions[]>} Promise resolving with a list of versions if available;
	 * rejects if an error occurs or the layer does not support draft handling
	 */
	VersionsAPI.getVersions = function (mPropertyBag) {
		if (!mPropertyBag.selector) {
			return Promise.reject("No selector was provided");
		}
		if (!mPropertyBag.layer) {
			return Promise.reject("No layer was provided");
		}

		var oAppComponent = Utils.getAppComponentForControl(mPropertyBag.selector);
		var sReference = Utils.getComponentClassName(oAppComponent);

		if (!sReference) {
			return Promise.reject("The application ID could not be determined");
		}

		return Versions.getVersions({
			reference: sReference,
			layer: mPropertyBag.layer
		});
	};

	return VersionsAPI;
});
