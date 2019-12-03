/*******************************************************************************
 * Copyright © 2017-2018 VMware, Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 *
 * @author: Huaqiao Zhang, <huaqiaoz@vmware.com>
 * @version: 0.1.0
 *******************************************************************************/
$(document).ready(function(){
	//init loading data.
	orgEdgexFoundry.deviceService.loadDeviceService();
	orgEdgexFoundry.deviceService.loadDeviceProfile();	
	orgEdgexFoundry.deviceService.loadDevice("");
	$("#edgexfoundry-device-main").show();
	// $("#add_new_element").hide("fast");

});

orgEdgexFoundry.deviceService = (function(){
	"use strict";
	function DeviceService() {
		this.deviceServiceListCache = [];
		this.selectedRow = null;
    this.deviceProtocols = null;

    this.selectedDeviceServiceName = null;

	}

	DeviceService.prototype = {
		constructor: DeviceService,
		loadDeviceService: null,
		renderDeviceService: null,
		renderServiceAddressable: null,
		refreshDeviceService: null,
		hideServiceAddressablePanel: null,
		
		loadDevice: null,
		renderDevice: null,
    	refreshDevice: null,
		addDevice: null,
		editDevice:null,
		uploadDevice: null,
		cancelAddOrUpdateDevice: null,
		deleteDevice: null,
		hideDevicePanel: null,		

		addSchedule: null,
		addNewSchedule: null,
		backSchedule:  null,
		deleteSchedule: null,
		renderScheduleList: null,

		cancelAddOrUpdateElement: null,		
		addElement: null,
		addNewElement: null,
		backElement:  null,
		deleteElement: null,
		showElementAndCommand: null,
		renderElementList: null,
		renderCommandList: null,
    addProtocol: null,
    addProtocolField: null,
    resetProtocol: null,
    setProtocol: null,
    getProtocolFormValue: null,
    removeProtocolField: null,

		loadDeviceProfile: null,
		renderDeviceProfile: null,
		showUploadFilePanel: null,
		uploadProfile: null,
		deleteProfile: null,
		refreshProfile: null,
		cancelAddDeviceProfile: null,
		onSelectFileCompleted: null,
	}

	var deviceService = new DeviceService();

  DeviceService.prototype.removeProtocolField = function(deviceProtocolFieldKey) {
    delete deviceService.deviceProtocols.deviceProtocolName[deviceProtocolFieldKey];
    $(".edgexfoundry-device-protocols input[name=\'" + deviceProtocolFieldKey+ "\']").parent(".protocol-field").remove();
  }

  DeviceService.prototype.getProtocolFormValue = function() {
    var protocolFields = Object.entries(deviceService.deviceProtocols.deviceProtocolName);
    var protocols = {};
    var protocolName =  $(".edgexfoundry-device-protocols input[name='deviceProtocolName']").val().trim();
    protocols[protocolName] = {};
    for (var i = 0; i < protocolFields.length; i++) {
      var fieldKey =  $(".edgexfoundry-device-protocols input[name=\'" + protocolFields[i][0]+ "\']").val().trim();
      var fieldValue =  $(".edgexfoundry-device-protocols input[name=\'" + protocolFields[i][1]+ "\']").val().trim();
      protocols[protocolName][fieldKey] = fieldValue;
    }

    return protocols;
  }

  DeviceService.prototype.setProtocol = function(protocols){
    var deviceProtocolName = Object.keys(protocols)[0];
    var protocolFields = Object.entries(protocols[deviceProtocolName]);

    for (var i = 1; i < protocolFields.length; i++) {
      deviceService.addProtocolField();
    }

    $(".edgexfoundry-device-protocols input[name='deviceProtocolName']").val(deviceProtocolName);

    for (var i = 0; i < protocolFields.length; i++) {
      $(".edgexfoundry-device-protocols  input[name='deviceProtocolFieldKey-"+i+"']").val(protocolFields[i][0]);
      $(".edgexfoundry-device-protocols  input[name='deviceProtocolFieldValue-"+i+"']").val(protocolFields[i][1]);
    }
  }

  DeviceService.prototype.resetProtocol = function(){
    if (deviceService.deviceProtocols == null) {
      return;
    }
    $(".edgexfoundry-device-protocols .protocol-field-collection").empty();

    deviceService.deviceProtocols = null;
  }

  DeviceService.prototype.addProtocol = function(){
    deviceService.deviceProtocols = {};
    deviceService.deviceProtocols["deviceProtocolName"] = {};
    var deviceProtocolFieldKey = "deviceProtocolFieldKey-0";
    var deviceProtocolFieldValue = "deviceProtocolFieldValue-0";

    deviceService.deviceProtocols.deviceProtocolName[deviceProtocolFieldKey] = deviceProtocolFieldValue;

    var field = '<div class="protocol-field" style="margin-bottom:5px;">';
    field += '<input type="text" class="form-control" style="display:inline!important;" name="' + deviceProtocolFieldKey + '">&nbsp;:&nbsp;';
    field += '<input type="text" class="form-control" style="display:inline!important;" name="'+ deviceProtocolFieldValue +'">';
    field += '<div class="edgexIconBtn" onclick="orgEdgexFoundry.deviceService.removeProtocolField(\''+deviceProtocolFieldKey+'\');">';
    field += '<i class="fa fa-minus-circle fa-lg" aria-hidden="true"></i>';
    field += '</div>';
    field += '</div>';

    $(".device-protocol .protocol-body .protocol-field-collection").append(field);

  }

  DeviceService.prototype.addProtocolField = function(){

    var fieldKeysArray;
    if (deviceService.deviceProtocols == null){
      deviceService.addProtocol();
      fieldKeysArray = Object.keys(deviceService.deviceProtocols["deviceProtocolName"]);
    } else {
      fieldKeysArray = Object.keys(deviceService.deviceProtocols["deviceProtocolName"]);
    }

    var deviceProtocolFieldKey = "deviceProtocolFieldKey-" + fieldKeysArray.length;
    var deviceProtocolFieldValue = "deviceProtocolFieldValue-" + fieldKeysArray.length;

    deviceService.deviceProtocols.deviceProtocolName[deviceProtocolFieldKey] = deviceProtocolFieldValue;

    var field = '<div class="protocol-field" style="margin-bottom:5px;">';
    field += '<input type="text" class="form-control" style="display:inline!important;" name="' + deviceProtocolFieldKey + '">&nbsp;:&nbsp;';
    field += '<input type="text" class="form-control" style="display:inline!important;" name="'+ deviceProtocolFieldValue +'">';
    field += '<div class="edgexIconBtn" onclick="orgEdgexFoundry.deviceService.removeProtocolField(\''+deviceProtocolFieldKey+'\');">';
    field += '<i class="fa fa-minus-circle fa-lg" aria-hidden="true"></i>';
    field += '</div>';
    field += '</div>';

    $(".device-protocol .protocol-body .protocol-field-collection").append(field);

  }

	// =======device service start
	DeviceService.prototype.loadDeviceService = function(){
		$.ajax({
			url: '/core-metadata/api/v1/deviceservice',
			type: 'GET',
			success: function(data){
				if (!data || data.length == 0) {
					$("#edgexfoundry-device-service-list table tfoot").show();
					return;
				}
				deviceService.renderDeviceService(data);
			},
			statusCode: {

			}
		});
	}

	DeviceService.prototype.renderDeviceService = function(deviceServices){
		$("#edgexfoundry-device-service-list table tbody").empty();
		$.each(deviceServices,function(i,v){
      var rowData = "<tr>";
      rowData += "<td>" + (i + 1) +"</td>";
      rowData += "<td>" +  v.id + "</td>";
      rowData += "<td>" +  v.name + "</td>";
			rowData += "<td>" +  (v.description?v.description:"") + "</td>";
      rowData += "<td>" +  (v.labels?v.labels.join(','):"") + "</td>";
			rowData += '<td class="device-service-addressable-search-icon"><input type="hidden" value=\''+JSON.stringify(v.addressable)+'\'>' + '<i class="fa fa-search-plus fa-lg"></i>' + '</td>';
      rowData += "<td>" +  v.operatingState + "</td>";
      rowData += "<td>" +  v.adminState + "</td>";
			rowData += '<td class="device-service-devices-inlcuded-icon"><input type="hidden" value=\''+v.name+'\'>' + '<i class="fa fa-sitemap fa-lg"></i>' + '</td>';
      rowData += "<td>" +  dateToString(v.created) + "</td>";
      rowData += "<td>" +  dateToString(v.modified) + "</td>";
      rowData += "</tr>";
	  $("#edgexfoundry-device-service-list table tbody").append(rowData);	  
    });
		$(".device-service-addressable-search-icon").on('click',function(){
			var addressable = JSON.parse($(this).children('input[type="hidden"]').val());
			deviceService.renderServiceAddressable(addressable);
			$(".device-service-addressable").show();
		});

		$(".device-service-devices-inlcuded-icon").on('click',function(){
			var serviceName = $(this).children('input[type="hidden"]').val();
      deviceService.selectedDeviceServiceName = serviceName;
			deviceService.loadDevice(serviceName);			
			$("#edgexfoundry-device-main").show();
		});
	}

	DeviceService.prototype.renderServiceAddressable = function(addr){
		$(".device-service-addressable table tbody").empty();
		var rowData = "<tr class='warning'>";
		rowData += "<td>" +  addr.id + "</td>";
		rowData += "<td>" +  addr.name + "</td>";
		rowData += "<td>" +  addr.protocol + "</td>";
		rowData += "<td>" +  addr.address + "</td>";
		rowData += "<td>" +  addr.port + "</td>";
		rowData += "<td>" +  addr.path + "</td>";
		rowData += "<td>" +  dateToString(addr.created) + "</td>";
		rowData += "<td>" +  dateToString(addr.modified) + "</td>";
		rowData += "</tr>";
		$(".device-service-addressable table tbody").append(rowData);
	}

	DeviceService.prototype.hideServiceAddressablePanel = function(){
		$(".device-service-addressable").hide();
	}

	DeviceService.prototype.refreshDeviceService = function(){
		deviceService.loadDeviceService();
	}
	// =======device service end

	//========device start
// schedule ============= start ===========

DeviceService.prototype.addSchedule = function(){
	$("#add-device-btn").hide();		
	$(".edgexfoundry-device-command").hide();				
	$(".edgexfoundry-device-element").hide();		
	$(".edgexfoundry-device-schedule").hide();		
	$("#add_new_schedule").show("fast");
}

DeviceService.prototype.backSchedule = function(){
	orgEdgexFoundry.deviceService.loadDevice("");
	$("#add-device-btn").show();		
	$("#add_new_schedule").hide("fast");
}

DeviceService.prototype.addNewSchedule = function(){
	var _ower = document.getElementById("add_schedule_objectname").value;
	var _name = document.getElementById("add_schedule_schedulename").value;
	var _time = document.getElementById("add_schedule_time").value;
	var _command = document.getElementById("add_schedule_command").value;
	var _body = document.getElementById("add_schedule_body").value;

	var objectname = _ower;
	var schedulename = 	_name;
			
	var scheduleContent = {
		ower: _ower,
		name: _name,
		time: parseInt(_time),
		command: _command,
		body : _body,
	};							

	$.ajax({
		url:'object/api/v1/object/name/' + objectname + "/schedule/" + schedulename,
		type:'POST',
		data:JSON.stringify(scheduleContent),
		contentType:'application/json',
		success:function(){
			bootbox.alert({
				message: "add or update success!",
				className: 'red-green-buttons'
			});
			deviceService.backSchedule();
		},
		statusCode: {
			400: function(){
				bootbox.alert({
					title: "Error",
					message: " incorrect or unparsable requests !",
					className: 'red-green-buttons'
				});
			},
			404: function(){
				bootbox.alert({
					title: "Error",
					message: " request errorr !",
					className: 'red-green-buttons'
				});
			}
		}
	});
}	

DeviceService.prototype.renderScheduleList = function(device){		
	$(".edgexfoundry-device-schedule table tbody").empty();						
	var arrKeys = Object.keys(device.protocols);
	for (var i = 0; i < arrKeys.length; i++) {		
		var keySchedule = arrKeys[i];					
		if( keySchedule != "Schedule"){
			continue;
		}
		var content = Object.entries(device.protocols[keySchedule]);
		for( var j = 0; j < content.length; j++){
			var schedulename = content[j][0];
			var schedulebody = content[j][1];			
			var bodyjson = JSON.parse(schedulebody);
			var rowData = '<tr>';			
				rowData += '<td class="schedule-delete-icon"><input type="hidden" value=\''+device.name+","+ schedulename+ '\'><div class="edgexIconBtn"><i class="fa fa-trash-o fa-lg" aria-hidden="true"></i> </div></td>';
				// rowData += '<td>' + (j+1) + '</td>' ;
				rowData += '<td>' + schedulename + '</td>';
				rowData += '<td>' +bodyjson.time+ '</td>';
				rowData += '<td>' +bodyjson.command + '</td>';				
				rowData += '<td>' +bodyjson.body + '</td>';				
				rowData += '</tr>';
			$(".edgexfoundry-device-schedule table tbody").append(rowData);		
		}														
	}		
	$(".edgexfoundry-device-schedule .schedule-delete-icon").on('click',function(){
		var str = $(this).children('input').val();			
		deviceService.deleteSchedule(str);
	});
	$(".edgexfoundry-device-schedule").show();  
}

DeviceService.prototype.deleteSchedule = function(str){		
	var info = str.split(",");
	bootbox.confirm({
		title: "confirm",
		message: "Are you sure to remove element? ",
		className: 'green-red-buttons',
		callback: function (result) {
			if (result) {
				$.ajax({
					url: '/object/api/v1/object/name/' + info[0] + "/schedule/" + info[1],
					type: 'DELETE',
					success: function(){
		  bootbox.alert({
			message: "remove scheduke success !",
			className: 'red-green-buttons'
		  });			  		
		  $(".edgexfoundry-device-command").hide();
		  $(".edgexfoundry-device-element").hide();
		  $(".edgexfoundry-device-schedule").hide();			
					},
					statusCode: {
						400: function(){
							bootbox.alert({
								title: "Error",
								message: " incorrect or unparsable requests !",
								className: 'red-green-buttons'
							});
						},
						404: function(){
							bootbox.alert({
								title: "Error",
								message: " request errorr !",
								className: 'red-green-buttons'
							});
						},
					}
				});
			}
		}
	});
}

// schedule ============= end =============
  DeviceService.prototype.refreshDevice = function(){
	deviceService.loadDevice(deviceService.selectedDeviceServiceName);	
  }

	DeviceService.prototype.hideDevicePanel = function(){
		$("#edgexfoundry-device-main").hide();
	}
	DeviceService.prototype.loadDevice = function(serviceName){
		$.ajax({
			// url: '/core-metadata/api/v1/device/servicename/' + serviceName,
			url: '/object/api/v1/object',
			type: 'GET',
			success: function(data){
				deviceService.renderDevice(data);
			},
			statusCode: {

			}
		});
	}

	DeviceService.prototype.renderDevice = function(devices){
		$(".edgexfoundry-device-list-table table tbody").empty();
		$("#edgexfoundry-device-list table tfoot").hide();
		if (!devices || devices.length == 0) {

			$("#edgexfoundry-device-list table tfoot").show();
			return;
		}
		$.each(devices,function(i,v){
      var rowData = "<tr>";
		rowData += '<td class="device-delete-icon"><input type="hidden" value=\''+JSON.stringify(v)+'\'><div class="edgexIconBtn"><i class="fa fa-trash-o fa-lg" aria-hidden="true"></i> </div></td>';
      	rowData += '<td class="device-edit-icon"><input type="hidden" value=\''+JSON.stringify(v)+'\'><div class="edgexIconBtn"><i class="fa fa-edit fa-lg" aria-hidden="true"></i> </div></td>';
      	rowData += "<td>" + (i + 1) +"</td>";
      	rowData += "<td>" +  v.id + "</td>";
      	rowData += "<td>" +  v.name + "</td>";
		rowData += "<td>" +  v.description + "</td>";
		if (v.labels) {
			rowData += "<td>" + v.labels[0] + "</td>";
		} else {
			rowData += "<td>" + "</td>";
		}
			
		rowData += '<td class="device-command-icon"><input type="hidden" value=\''+v.name+'\'>' + '<i class="fa fa-terminal fa-lg"></i>' + '</td>';
		rowData += "<td>" +  v.profile.name + "</td>";
		rowData += "<td>" +  v.operatingState + "</td>";
		rowData += "<td>" +  v.adminState + "</td>";
		rowData += "<td>" +  dateToString(v.created) + "</td>";
		rowData += "<td>" +  dateToString(v.modified) + "</td>";
		rowData += "</tr>";
	  $(".edgexfoundry-device-list-table table tbody").append(rowData);
	  $(".edgexfoundry-device-command").hide();
	  $(".edgexfoundry-device-element").hide();
	  $(".edgexfoundry-device-schedule").hide();		
    });

		$("#edgexfoundry-device-list .device-delete-icon").on('click',function(){
			var device = JSON.parse($(this).children('input').val());
			deviceService.deleteDevice(device);
		});

		$("#edgexfoundry-device-list .device-edit-icon").on('click',function(){
			var device = JSON.parse($(this).children('input').val());			
			deviceService.editDevice(device);
		});

		$("#edgexfoundry-device-list .device-command-icon").on('click',function(){
			var devicename = $(this).children('input').val();
			deviceService.showElementAndCommand(devicename);
		});
	}
	DeviceService.prototype.showElementAndCommand = function(devicename) {
		$.ajax({
			url:'/object/api/v1/object/name/' + devicename + '/commandlist',
			type: 'GET',
			success:function(data){					
				deviceService.renderCommandList(devicename, data);
				$(".edgexfoundry-device-command").show();								
			}
		});
	}

	DeviceService.prototype.addElement = function(){
		$("#add-device-btn").hide();		
		$(".edgexfoundry-device-command").hide();				
		$(".edgexfoundry-device-element").hide();	
		$(".edgexfoundry-device-schedule").hide();			
		$("#add_new_element").show("fast");
	}

	DeviceService.prototype.backElement = function(){
		orgEdgexFoundry.deviceService.loadDevice("");
		$("#add-device-btn").show();		
		$("#add_new_element").hide("fast");
	}

	DeviceService.prototype.addNewElement = function(){
		var _ower = document.getElementById("add_element_objectname").value;
		var _name = document.getElementById("add_element_elementname").value;
		var _command = document.getElementById("add_element_command").value;
		var _body = document.getElementById("add_element_body").value;

		var objectname = _ower;
		var elementname = 	_name;
				
		var elementContent = {
			ower: _ower,
			name: _name,
			command: _command,
			body : _body,
		};							
	
		$.ajax({
			url:'object/api/v1/object/name/' + objectname + "/element/" + elementname,
			type:'POST',
			data:JSON.stringify(elementContent),
			contentType:'application/json',
			success:function(){
				bootbox.alert({
					message: "add or update success!",
					className: 'red-green-buttons'
				});
				deviceService.backElement();
			},
			statusCode: {
				400: function(){
					bootbox.alert({
						title: "Error",
						message: " incorrect or unparsable requests !",
						className: 'red-green-buttons'
					});
				},
				404: function(){
					bootbox.alert({
						title: "Error",
						message: " request errorr !",
						className: 'red-green-buttons'
					});
				}
			}
		});
	}	

	DeviceService.prototype.editDevice = function(device){		
    deviceService.resetProtocol();
    deviceService.setProtocol(device.protocols);

		$(".edgexfoundry-device-update-or-add .add-device").hide();
		$(".edgexfoundry-device-update-or-add .update-device").show();

		$("#device-update-or-add .edgexfoundry-device-form input[name='deviceServiceName']").attr('value', device.service.name);
		$("#device-update-or-add .edgexfoundry-device-form input[name='deviceServiceName']").prop('disabled', true);
		$("#device-update-or-add .edgexfoundry-device-form  input[name='deviceID']").attr('value', device.id);
		$("#device-update-or-add .edgexfoundry-device-form  input[name='deviceName']").attr('value', device.name);
		$("#device-update-or-add .edgexfoundry-device-form input[name='deviceDescription']").attr('value', device.description);
		$("#device-update-or-add .edgexfoundry-device-form  input[name='deviceLabels']").attr('value', device.labels[0]);
		$("#device-update-or-add .edgexfoundry-device-form  option[value='" + device.labels[0] +"']").attr("selected","true");		
		$('select[name="deviceLabels"]').attr('disabled', 'disabled');

		$("#device-update-or-add .edgexfoundry-device-form  input[name='deviceLabels']").prop("disabled", true);
		$("#device-update-or-add .edgexfoundry-device-form  input[name='deviceLabels']").prop('disabled', true);
		$("#device-update-or-add .edgexfoundry-device-form  input[name='deviceAdminState']").attr('value', device.adminState);
		$("#device-update-or-add .edgexfoundry-device-form  input[name='deviceOperatingState']").attr('value', device.operatingState);
		$("#device-update-or-add .edgexfoundry-device-form  input[name='deviceProfile']").attr('value', device.profile.name);

		$("#edgexfoundry-device-list").hide();		
		$("#device-update-or-add").show();
	}

	DeviceService.prototype.addDevice = function(){
    deviceService.resetProtocol();
	deviceService.addProtocol();	
			
	$("#device-update-or-add .edgexfoundry-device-form input[name='deviceServiceName']").attr('value', "");
	$("#device-update-or-add .edgexfoundry-device-form input[name='deviceServiceName']").prop('disabled', false);
	$("#device-update-or-add .edgexfoundry-device-form  input[name='deviceID']").attr('value', "");
	$("#device-update-or-add .edgexfoundry-device-form  input[name='deviceName']").attr('value', "");
	$("#device-update-or-add .edgexfoundry-device-form input[name='deviceDescription']").attr('value', "");
	$("#device-update-or-add .edgexfoundry-device-form  input[name='deviceLabels']").attr('value', "");
	$("#device-update-or-add .edgexfoundry-device-form  input[name='deviceLabels']").removeAttr('disabled');
	$("#device-update-or-add .edgexfoundry-device-form  option[value='DeviceType']").removeAttr('selected');
	$("#device-update-or-add .edgexfoundry-device-form  option[value='GroupType']").removeAttr('selected');
	$("#device-update-or-add .edgexfoundry-device-form  option[value='ScenrioType']").removeAttr('selected');
	$('select[name="deviceLabels"]').removeAttr('disabled');
	
	$("#device-update-or-add .edgexfoundry-device-form  input[name='deviceAdminState']").attr('value', "");
	$("#device-update-or-add .edgexfoundry-device-form  input[name='deviceOperatingState']").attr('value', "");
	$("#device-update-or-add .edgexfoundry-device-form  input[name='deviceProfile']").attr('value', "");

	$("#edgexfoundry-device-list").hide();		
	$("#device-update-or-add").show();
	$(".edgexfoundry-device-update-or-add .update-device").hide();
	$(".edgexfoundry-device-update-or-add .add-device").show();				
	}

	DeviceService.prototype.cancelAddOrUpdateDevice = function(){
		$("#edgexfoundry-device-list").show();
		// $("#edgexfoundry-device-main .edgexfoundry-device-update-or-add").hide();
		$("#device-update-or-add").hide();
	}

	DeviceService.prototype.uploadDevice = function(type){
		var method;
		if(type=="new"){
			method = "POST"
		}else{
			method = "PUT"
		}		
		//debugger	
		var arrLabels = document.getElementsByName("deviceLabels")[0].value.split(",");
		
		var device = {
			service: {
				name: document.getElementsByName("deviceServiceName")[0].value,
			},
			id: document.getElementsByName("deviceID")[0].value,
			name: document.getElementsByName("deviceName")[0].value,
			description: document.getElementsByName("deviceDescription")[0].value,
			labels: arrLabels,
			adminState: document.getElementsByName("deviceAdminState")[0].value,
			operatingState: document.getElementsByName("deviceOperatingState")[0].value,
			profile: {
				name: document.getElementsByName("deviceProfile")[0].value,
			},
		};

	device['protocols'] = deviceService.getProtocolFormValue();
	alert(JSON.stringify(device));

    $.ajax({
      url: '/object/api/v1/object',
      type: method,
      data:JSON.stringify(device),
      success: function(){
        deviceService.refreshDevice();
        bootbox.alert({
          message: "commit success!",
          className: 'red-green-buttons'
        });
      },
      statusCode: {
        400: function(){
          bootbox.alert({
            title: "Error",
            message: "the request is malformed or unparsable or if an associated object (Addressable, Profile, Service) cannot be found with the id or name provided !",
            className: 'red-green-buttons'
          });
        },
        409: function(){
          bootbox.alert({
            title: "Error",
            message: "the name is determined to not be unique with regard to others !",
            className: 'red-green-buttons'
          });
        },
        500: function(){
          bootbox.alert({
            title: "Error",
            message: "unknown or unanticipated issues !",
            className: 'red-green-buttons'
          });
        }
      }
    });
	}

	DeviceService.prototype.deleteDevice = function(device){
		bootbox.confirm({
			title: "confirm",
			message: "Are you sure to remove device? ",
			className: 'green-red-buttons',
			callback: function (result) {
				if (result) {
					$.ajax({
						url: '/object/api/v1/object/name/' + device.name,
						type: 'DELETE',
						success: function(){
              bootbox.alert({
                message: "remove device success !",
                className: 'red-green-buttons'
              });
			  deviceService.loadDevice(device.service.name);			
			  $(".edgexfoundry-device-command").hide();
			  $(".edgexfoundry-device-element").hide();
			  $(".edgexfoundry-device-schedule").hide();			
						},
						statusCode: {
							400: function(){
								bootbox.alert({
									title: "Error",
									message: " incorrect or unparsable requests !",
									className: 'red-green-buttons'
								});
							},
							404: function(){
								bootbox.alert({
									title: "Error",
									message: " the device cannot be found by the id provided !",
									className: 'red-green-buttons'
								});
							},
						}
					});
				}
			}
		});
	}

	DeviceService.prototype.deleteElement = function(str){		
		var info = str.split(",");
		bootbox.confirm({
			title: "confirm",
			message: "Are you sure to remove element? ",
			className: 'green-red-buttons',
			callback: function (result) {
				if (result) {
					$.ajax({
						url: '/object/api/v1/object/name/' + info[0] + "/element/" + info[1],
						type: 'DELETE',
						success: function(){
              bootbox.alert({
                message: "remove element success !",
                className: 'red-green-buttons'
              });			  		
			  $(".edgexfoundry-device-command").hide();
			  $(".edgexfoundry-device-element").hide();
			  $(".edgexfoundry-device-schedule").hide();			
						},
						statusCode: {
							400: function(){
								bootbox.alert({
									title: "Error",
									message: " incorrect or unparsable requests !",
									className: 'red-green-buttons'
								});
							},
							404: function(){
								bootbox.alert({
									title: "Error",
									message: " request errorr !",
									className: 'red-green-buttons'
								});
							},
						}
					});
				}
			}
		});
	}
	DeviceService.prototype.renderElementList = function(device){	
		if (device.labels[0] == "DeviceType")	{
			$(".edgexfoundry-device-element").hide();
			return;
		}		
		$(".edgexfoundry-device-element table tbody").empty();						
		var arrKeys = Object.keys(device.protocols);
		for (var i = 0; i < arrKeys.length; i++) {		
			var nameElement = arrKeys[i];			
			var typeElement = "";			
			var command;
			var body;
			if( nameElement == "Network" || nameElement == "Schedule"){
				continue;
			}
			var content = Object.entries(device.protocols[nameElement]);
			for( var j = 0; j < content.length; j++){			
				if (content[j][0] == "type"){
					typeElement = content[j][1];					
				}				
				if (content[j][0] == "command") {					
					command = content[j][1];
				}
				if (content[j][0] == "body") {					
					body = content[j][1];
				}
			}						
			var rowData = '<tr>';			
				rowData += '<td class="element-delete-icon"><input type="hidden" value=\''+device.name+","+ nameElement+ '\'><div class="edgexIconBtn"><i class="fa fa-trash-o fa-lg" aria-hidden="true"></i> </div></td>';
				rowData += '<td>' + nameElement + '</td>' ;
				rowData += '<td>' + typeElement + '</td>';
				rowData += '<td>' + command + '</td>';
				rowData += '<td>' + body + '</td>';
				rowData += '<td>' + '<input type="text" class="form-control" name="element_reading_value'+device.name+"_"+ nameElement+'" disabled style="width:200px;display:inline;">' + '</td>';
				rowData += '<td>' + '<input type="text" class="form-control" name="element_reading_time'+device.name+"_"+nameElement+'" disabled style="width:200px;display:inline;">' + '</td>';				
				rowData += '</tr>';
			$(".edgexfoundry-device-element table tbody").append(rowData);				
		}		
		$(".edgexfoundry-device-element .element-delete-icon").on('click',function(){
			var str = $(this).children('input').val();			
			deviceService.deleteElement(str);
		});
		$(".edgexfoundry-device-element").show();  
	}

	DeviceService.prototype.renderCommandList = function(devicename, commands){									
		function callback(data) {
			var typedevice = data.labels[0];				
			$(".edgexfoundry-device-command table tbody").empty();
			$.each(commands,function(i,v){			
				var rowData = '<tr>';						
					rowData += '<td>' + v.name + '</td>';

					rowData += '<td>'
					if(v.get) {
						rowData += '<input type="radio"  name="commandRadio_'+v.id+'" checked value="get" style="width:20px;">&nbsp;get'
					}
					if(v.put && v.put.parameterNames) {
						rowData	+= '&nbsp;<input type="radio" name="commandRadio_'+v.id+'" value="set"  style="width:20px;">&nbsp;set'
					}else{
						rowData	+= '<span style="visibility:hidden;">&nbsp;<input type="radio" name="commandRadio_'+v.id+'" value="set"  style="width:20px;">&nbsp;set</span>'
					}
					rowData	+= '</td>';

					rowData += '<td>' + '<input type="text" class="form-control" name="reading_value'+v.id+'" disabled style="width:200px;display:inline;">' + '</td>'
					rowData += '<td>';
					if(v.put != null) {
						$.each(v.put.parameterNames,function(i,p){
							rowData += p + '&nbsp;<input type="text" class="form-control" name="' + p +v.id + '" style="width:100px;display:inline;">&nbsp;'
						});
					}
					rowData += '</td>';
					rowData += '<td>'
						+ '<button id=\''+v.id+'\' value=\'' + devicename + "," + typedevice + '\' type=\'button\' class=\'btn btn-success\'  onclick=\'orgEdgexFoundry.deviceService.sendCommand(' +JSON.stringify(v)+')\'>send</button>'
						+ '</td>';
					rowData += '</tr>';
		  		$(".edgexfoundry-device-command table tbody").append(rowData);	  
			});	
		}
		$.ajax({			
			url: '/object/api/v1/object/name/' +  devicename,
			dataType: "json",        			 
			type: 'GET',
			success: function(data){
				callback(data);
				if (!data) {					
					return;
				}					
				deviceService.renderScheduleList(data);
				deviceService.renderElementList(data);									
			},
			statusCode: {
			}
		});				
	}

	DeviceService.prototype.sendCommand = function(command){		
		var devicenameandtype = $('#'+command.id+'').val();		
		var array = devicenameandtype.split(",");
		var devicename = array[0];
		var typedevice = array[1];

		$('#'+command.id+'').prop('disabled',true);
		var method = $('.edgexfoundry-device-command tbody input[name="commandRadio_'+command.id+'"]:radio:checked').val();
		var cmdUrl = "/object/api/v1/object/name/" + devicename + "/command/" + command.name;		
		if(method == 'set' && command.put != null) {			
			var paramBody={};
			$.each(command.put.parameterNames,function(i,param){
				//debugger
				var p = $('.edgexfoundry-device-command table tbody input[name="' + param + command.id + '"]').val();
				paramBody[param] = p;
			});
			console.log(JSON.stringify(paramBody))
			$.ajax({
				url:cmdUrl,
				type:'PUT',
				contentType:'application/json',
				data:JSON.stringify(paramBody),
				success:function(data){
					$('.edgexfoundry-device-command tbody input[name="reading_value'+command.id+'"]').val("success");
					$('#'+command.id+'').prop('disabled',false);
				},
				error:function(){
					$('.edgexfoundry-device-command tbody input[name="reading_value'+command.id+'"]').val("failed");
					$('#'+command.id+'').prop('disabled',false);
				}
			});
		} else {			
			$.ajax({
				url:cmdUrl,
				type:'GET',
				success:function(data){
					$.each(data,function(i,v){						
					if (typedevice == "DeviceType") {
						$('.edgexfoundry-device-command tbody input[name="reading_value'+command.id+'"]').val(data[i].readings[0].value);
					} else {
						$('.edgexfoundry-device-element tbody input[name="element_reading_value'+ devicename +"_" + data[i].device +'"]').val(data[i].readings[0].value);
						var intTime = data[i].created;												
						var strTime = "Khong tim thay du lieu";
						if (intTime > 0) {							
							// alert(intTime.toString());
							strTime = dateToString(intTime );							
						}

						$('.edgexfoundry-device-element tbody input[name="element_reading_time'+ devicename +"_" + data[i].device +'"]').val(strTime);
					}					
					$('#'+command.id+'').prop('disabled',false);
					})
				},
				error:function(){
					$('.edgexfoundry-device-command tbody input[name="reading_value'+command.id+'"]').val("failed");
					$('#'+command.id+'').prop('disabled',false);
				}
			});
		}
	}
	//========device end

	//========device profile start
	DeviceService.prototype.loadDeviceProfile = function(){
		$.ajax({
			url: '/core-metadata/api/v1/deviceprofile',
			type: 'GET',
			success: function(data){
				if (!data || data.length == 0) {
					$(".edgexfoundry-device-profile-main table tfoot").show();
					return;
				}
				deviceService.renderDeviceProfile(data);
				$(".edgexfoundry-device-profile-main table tfoot").hide();
			},
			statusCode: {

			}
		});
	}

	DeviceService.prototype.renderDeviceProfile = function(deviceprofiles){
		$(".edgexfoundry-device-profile-main table tbody").empty();
		$.each(deviceprofiles,function(i,v){
			var rowData = "<tr>";
			rowData += '<td class="deviceprofile-delete-icon"><input type="hidden" value=\''+v.id+'\'><div class="edgexIconBtn"><i class="fa fa-trash-o fa-lg" aria-hidden="true"></i> </div></td>';
			rowData += "<td>" + (i + 1) +"</td>";
			rowData += "<td>" +  v.id + "</td>";
			rowData += "<td>" +  v.name + "</td>";
			rowData += "<td>" +  v.description + "</td>";
			rowData += "<td>" +  v.labels.join(',') + "</td>";
			rowData += "<td>" +  dateToString(v.created) + "</td>";
			rowData += "<td>" +  dateToString(v.modified) + "</td>";
			rowData += "</tr>";
			$(".edgexfoundry-device-profile-main table tbody").append(rowData);
		});
		$(".deviceprofile-delete-icon").on('click',function(){
			var profileId = $(this).children("input[type='hidden']").val();
			deviceService.deleteProfile(profileId);
		});
	}

	DeviceService.prototype.deleteProfile = function(profileId){
		//debugger
		bootbox.confirm({
			title: "confirm",
      message: "Are you sure to remove ? ",
      className: 'green-red-buttons',
      callback: function (result) {
				if (result) {
					$.ajax({
						url: '/core-metadata/api/v1/deviceprofile/id/' + profileId,
						method: 'DELETE',
						success: function(){
							bootbox.alert({
								message: "Remove Success !",
								className: 'red-green-buttons'
							});
							deviceService.loadDeviceProfile();
						},
						statusCode: {
							404: function(){
								bootbox.alert({
									title: "Error",
									message: "device profile cannot be found with the identifier provided !",
									className: 'red-green-buttons'
								});
							},
							409: function(){
								bootbox.alert({
									title: "Error",
									message: "Can't delete device profile, the profile is still in use by a device !",
									className: 'red-green-buttons'
								});
							},
							500: function(){
								bootbox.alert({
									title: "Error",
									message: "unknown or unanticipated issues !",
									className: 'red-green-buttons'
								});
							}
						}
					});
				}
			}
		});
	}

	DeviceService.prototype.refreshProfile = function(){
		deviceService.loadDeviceProfile();
	}

	DeviceService.prototype.showUploadFilePanel = function(){
		$("#add-profile-panel").show();
	}

	DeviceService.prototype.cancelAddDeviceProfile = function(){
		$("#add-profile-panel").hide();
	}

	DeviceService.prototype.uploadProfile = function(){
		$("#add-profile-panel").hide();

		var form = $("#add-profile-panel form")[0];
		form.action = "/core-metadata/api/v1/deviceprofile/uploadfile?X-Session-Token=" + window.sessionStorage.getItem('X_Session_Token');
		form.method = "POST"
		form.enctype="multipart/form-data"
		form.submit();
		var iframe = $("#add-profile-panel iframe")[0];
		iframe.onload = function(event) {
			var doc = iframe.contentDocument;
			var response = $(doc).find('body').html();
			var result = response.match("code");
			if (result != null || $(doc).find('body').find("h1").length != 0) {
				bootbox.alert({
					title: "Error",
					message: "upload profile failed !",
					className: 'red-green-buttons'
				});
			} else {
				form.reset();
				bootbox.alert({
					message: "upload success !",
					className: 'red-green-buttons'
				});
				orgEdgexFoundry.deviceService.loadDeviceProfile();
			}
		}
	}

	DeviceService.prototype.onSelectFileCompleted = function() {
		var uploadInput = $("#add-profile-action")
		if (uploadInput[0].value) {

			var fileSelected = uploadInput[0].files[0];
			$("#add-profile-panel .new-file-proview").val(fileSelected.name);
		}
	}

	//========device profile end

	return deviceService;
})();
