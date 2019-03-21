import { Globals } from './../utilities/globals';
import { Injectable, EventEmitter, Output, OnDestroy } from '@angular/core';
import { Http, Response } from '@angular/http';
import { AppEventBusService } from '../app.event-bus.service';

@Injectable({
  providedIn: 'root'
})

/**
 * *========================
 * !  UserManagementService 
 * *========================
 * 
 *  This Service is consumed by the Import Page && the Merchant Home Page (last loaded accounts)
 *  
 * 
 */

export class UserManagementService {

    /*---------------------
  * ! Event Emitters 
  *---------------------*/
  @Output() fetchUserMngmntEvent = new EventEmitter();

  @Output() getAllUsersEvent = new EventEmitter();
  @Output() createUserEvent = new EventEmitter();
  @Output() deleteUserEvent = new EventEmitter();
  @Output() updateUserEvent = new EventEmitter();
  
  @Output() getAllRolesEvent = new EventEmitter();
  @Output() createRoleEvent = new EventEmitter();
  @Output() deleteRoleEvent = new EventEmitter();
  @Output() updateRoleEvent = new EventEmitter();

  
  @Output() getUserManagementEvent = new EventEmitter();





  constructor( public globals: Globals,
               private eventBusService: AppEventBusService,
               public http: Http ) { }

  // ------------------
  // * User Operations
  // ------------------

/**
 * *---------------------
 * !  getAllUsers 
 * *---------------------
 *  address: USER_MNGMT_GET_ALL_USERS
 *  	returns: { users (array) }
 * 
 * **/
  getAllUsers() {
    const route = this.globals.SrvRoute.GET_ALL_USERS;
    // TODO: enable the belowed section

    this.eventBusService.send(route, {
      // 'reportType': this.globals.reportIds['MERCHANT_DATA']
      
    }, (error, message) => {
      if (error) {
        this.getAllUsersEvent.error(error);
      }
      if (message) {
        this.getAllUsersEvent.emit(message);
      }
    });

  }

/**
 * *---------------------
 * !  createUser 
 * *---------------------
 *  address: USER_MGMNT_CREATE_USER
 *  receive: { 
 *       name: (string, mandatory)	
 *       email: (string, mandatory)	
 *       roles: (array, mandatory)
 * 		   permissions: (array)
 *                	
*  returns: { success or fail (Error Description)}

 * 
 * **/
  createUser(userName, userEmail, userRoles, userChannels, userPermissions) {
    const route = this.globals.SrvRoute.CREATE_USER;
    // TODO: enable the belowed section

    this.eventBusService.send(route, {
      // 'reportType': this.globals.reportIds['MERCHANT_DATA']
      name: userName,
      email: userEmail,
      roles: userRoles,
      channels: userChannels, 
      permissions: userPermissions 
      
    }, (error, message) => {
      if (error) {
        this.getAllRolesEvent.error(error);
      }
      if (message) {
        this.getAllRolesEvent.emit(message);
      }
    });
  }

/**
 * *---------------------
 * !  deletUser 
 * *---------------------
 *  address: USER_MGMNT_DELETE_USER
 *  receive: { name: (string, mandatory)}	
 *  Returns: { success or fail (Error Description) }
 * 
 * **/
  deletUser(userName) {
    const route = this.globals.SrvRoute.DELETE_USER;
    // TODO: enable the belowed section

    this.eventBusService.send(route, {
      // 'reportType': this.globals.reportIds['MERCHANT_DATA']
      name: userName,
      
    }, (error, message) => {
      if (error) {
        this.deleteRoleEvent.error(error);
      }
      if (message) {
        this.deleteRoleEvent.emit(message);
      }
    });
  }

/**
 * *---------------------
 * !  updateUser 
 * *---------------------
 *  address: USER_MGMNT_UPDATE_USER
 *  receive: {
 *        name: (string, mandatory)
 *        email: (string)
 *        roles: (array)
 *        channels: (array)
 *        permissions: (array)
 *  {
           	
 *  Returns: { success or fail }
 * 
 * **/
  updateUser(userName, userEmail, userRoles, userChannels, userPermissions) {
    const route = this.globals.SrvRoute.UPDATE_USER;
    // TODO: enable the belowed section

    this.eventBusService.send(route, {
      // 'reportType': this.globals.reportIds['MERCHANT_DATA']
      name: userName,
      email: userEmail,
      channels: userChannels,
      roles: userRoles,
      permissions: userPermissions 
      
    }, (error, message) => {
      if (error) {
        this.updateRoleEvent.error(error);
      }
      if (message) {
        this.updateRoleEvent.emit(message);
      }
    });
  }

  // ------------------
  // * Role Operations
  // ------------------

/**
 * *---------------------
 * !  getAllRoles 
 * *---------------------
 *  address: USER_MNGMT_GET_ALL_ROLES
 *  	Returns{ roles (array() }
 * 
 * **/
  getAllRoles(){
    const route = this.globals.SrvRoute.GET_ALL_ROLES;
    // TODO: enable the belowed section

    this.eventBusService.send(route, {
      // 'reportType': this.globals.reportIds['MERCHANT_DATA']
      
    }, (error, message) => {
      if (error) {
        this.getAllRolesEvent.error(error);
      }
      if (message) {
        this.getAllRolesEvent.emit(message);
      }
    });
  }

/**
 * *---------------------
 * !  createRole 
 * *---------------------
 *  address: USER_MNGNT_CREATE_ROLE
 *   receive: { 
 *        name: (string, mandatory)
 *        permissions: (JsonArray, mandatory)	 
 *        leftNavMenu: (Json string, mandatory)
 *        reportIdsMenu: (Json string, mandatory)
 *	{
 *        	
 * 	Returns: {  success or fail (Error Description) }
 * 
 * **/
  createRole(roleName, rolePermissions, roleLeftNavMenu, roleReportIdsMenu){
    const route = this.globals.SrvRoute.CREATE_ROLE;
    // TODO: enable the belowed section

    this.eventBusService.send(route, {
      // 'reportType': this.globals.reportIds['MERCHANT_DATA']
      name: roleName,
      permissions: rolePermissions,
      leftNavMenu: roleLeftNavMenu,
      reportIdsMenu: roleReportIdsMenu
      
    }, (error, message) => {
      if (error) {
        this.createRoleEvent.error(error);
      }
      if (message) {
        this.createRoleEvent.emit(message);
      }
    });
  }

/**
 * *---------------------
 * !  updateRole 
 * *---------------------
 *  address: USER_MNGMT_UPDATE_ROLE
 *   receive: { 
 *        name: (string, mandatory)
 *        permissions: (JsonArray, mandatory)	 
 *        leftNavMenu: (Json string, mandatory)
 *        reportIdsMenu: (Json string, mandatory)
 *	{
 *        	
 * 	Returns: {  success or fail (Error Description) }
 * 
 * **/
  updateRole(roleName, rolePermissions, roleLeftNavMenu, roleReportIdsMenu){
    const route = this.globals.SrvRoute.UPDATE_ROlE;
    // TODO: enable the belowed section

    this.eventBusService.send(route, {
      // 'reportType': this.globals.reportIds['MERCHANT_DATA']
      name: roleName,
      permissions: rolePermissions,
      leftNavMenu: roleLeftNavMenu,
      reportIdsMenu: roleReportIdsMenu
      
    }, (error, message) => {
      if (error) {
        this.updateRoleEvent.error(error);
      }
      if (message) {
        this.updateRoleEvent.emit(message);
      }
    });
  }

  /**
   * *---------------------
   * !  deleteRole 
   * *---------------------
   *  address: USER_MNGMT_DELETE_ROLE
   *  receive: { name: (string, mandatory)}	
   *  Returns: { success or fail (Error Description) }
   * 
   * **/
    deleteRole(roleName) {
      const route = this.globals.SrvRoute.DELETE_ROLE;
      // TODO: enable the belowed section
  
      this.eventBusService.send(route, {
        // 'reportType': this.globals.reportIds['MERCHANT_DATA']
        name: roleName,
      }, (error, message) => {
        if (error) {
          this.deleteRoleEvent.error(error);
        }
        if (message) {
          this.deleteRoleEvent.emit(message);
        }
      });
    }
  
    /**
   * *---------------------
   * !  getUserManagementData 
   * *---------------------
   *  address: USER_MNGNT_GET_ALL_DATA
  *   returns: {
  *               users: [all users]
  *               roles :[all roles]
  *               channels: [all channels]
  *               permissions: [ all permissions]
  *	   }
   * 
   * **/
  getUserManagementData() {
    const route = this.globals.SrvRoute.GET_USER_MNGNT_DATA;

      return this.loadMockGetAllData();
      // TODO: enable the belowed section
  
      // this.eventBusService.send(route, {
      //   // 'reportType': this.globals.reportIds['MERCHANT_DATA']
      // }, (error, message) => {
      //   if (error) {
      //     this.getUserManagementEvent.error(error);
      //   }
      //   if (message) {
      //     this.getUserManagementEvent.emit(message);
      //   }
      // });
  }
  // *-------------------------------------------------------
 // !  MOCK AREA: Enable that section when working ofline
 // *-------------------------------------------------------

 loadMockGetAllData() {
  this.http.get("../../assets/data/userManagement.json")
    .map(data => data.json())
    .subscribe(data => {
      console.log(data);
      //let userManagementData;
      //userManagementData = this.filterDataByStatus(data);
      this.fetchUserMngmntEvent.emit(data);
    });
}

// *-------------------------------------------------------------------
// ! =================================================================
// *--------------------------------------------------------------------*/

}
