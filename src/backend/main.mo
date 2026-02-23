import List "mo:core/List";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Migration "migration";

// Specify the data migration function in with-clause
(with migration = Migration.run)
actor {
  // Include Storage and Authorization
  include MixinStorage();
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Data Types
  public type UserProfile = {
    name : Text;
    companyName : Text;
    contactDetails : Text;
    licenseInfo : Text;
  };

  public type TransactionType = {
    #buy;
    #sell;
    #rent;
  };

  public type ProjectStage = {
    #preLaunch;
    #launch;
    #readyToShift;
  };

  public type PropertyStatus = {
    #available;
    #sold;
    #rented;
    #pendingApproval;
  };

  public type Property = {
    id : Nat;
    location : Text;
    price : Nat;
    propertyType : Text;
    transactionType : TransactionType;
    projectStage : ProjectStage;
    status : PropertyStatus;
  };

  public type Partner = {
    principal : Principal;
    name : Text;
    companyName : Text;
    contactDetails : Text;
    licenseInfo : Text;
  };

  public type LeadStatus = {
    #new;
    #contacted;
    #inProgress;
    #closed;
  };

  public type Lead = {
    id : Nat;
    partnerPrincipal : Principal;
    customerName : Text;
    status : LeadStatus;
  };

  public type CommissionStatus = {
    #earned;
    #pending;
    #paid;
  };

  public type Commission = {
    id : Nat;
    partnerPrincipal : Principal;
    amount : Nat;
    status : CommissionStatus;
    paymentDate : ?Int;
  };

  public type QubeYardsUser = {
    principal : Principal;
    balance : Nat;
  };

  // Persistent Storage using Maps
  let userProfiles = Map.empty<Principal, UserProfile>();
  let partners = Map.empty<Principal, Partner>();
  let properties = Map.empty<Nat, Property>();
  let leads = Map.empty<Nat, Lead>();
  let commissions = Map.empty<Nat, Commission>();
  let qubeYardsUsers = Map.empty<Principal, QubeYardsUser>();

  // Counter arrays for persistent IDs
  var propertyIdCounter = List.fromArray<Nat>([0]);
  var leadIdCounter = List.fromArray<Nat>([0]);
  var commissionIdCounter = List.fromArray<Nat>([0]);

  // QubeYards currency reward amounts
  let propertyListingReward = 50;
  let referralReward = 100;

  // User Profile Management (Required by frontend)
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Partner Registration
  public shared ({ caller }) func registerPartner(
    name : Text,
    companyName : Text,
    contactDetails : Text,
    licenseInfo : Text,
  ) : async () {
    // Only authenticated users can register as partners
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can register as partners");
    };

    // Check if partner already exists
    if (partners.containsKey(caller)) {
      Runtime.trap("Partner already registered");
    };

    let partner : Partner = {
      principal = caller;
      name;
      companyName;
      contactDetails;
      licenseInfo;
    };

    partners.add(caller, partner);
  };

  // Add Property (Admin Only)
  public shared ({ caller }) func addProperty(
    location : Text,
    price : Nat,
    propertyType : Text,
    transactionType : TransactionType,
    projectStage : ProjectStage,
  ) : async () {
    // Authorization check for admin only
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add properties");
    };

    // Get the current property ID or default to 0
    var currentId = 0;
    if (propertyIdCounter.size() > 0) {
      currentId := propertyIdCounter.at(0);
    };

    let property : Property = {
      id = currentId;
      location;
      price;
      propertyType;
      transactionType;
      projectStage;
      status = #pendingApproval;
    };

    properties.add(currentId, property);
    // Increment property ID
    propertyIdCounter := List.fromArray<Nat>([currentId + 1]);
  };

  // Submit Property for Approval (Partners Only)
  public shared ({ caller }) func submitPropertyForApproval(
    location : Text,
    price : Nat,
    propertyType : Text,
    transactionType : TransactionType,
    projectStage : ProjectStage,
  ) : async () {
    // Only authenticated users (partners) can submit properties
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated partners can submit properties");
    };

    // Ensure only registered partners can submit properties
    if (not partners.containsKey(caller)) {
      Runtime.trap("Unauthorized: Only registered partners can submit properties");
    };

    // Get the current property ID or default to 0
    var currentId = 0;
    if (propertyIdCounter.size() > 0) {
      currentId := propertyIdCounter.at(0);
    };

    let property : Property = {
      id = currentId;
      location;
      price;
      propertyType;
      transactionType;
      projectStage;
      status = #pendingApproval;
    };

    properties.add(currentId, property);
    // Increment property ID
    propertyIdCounter := List.fromArray<Nat>([currentId + 1]);

    // Reward QubeYards currency for successful listing submission
    rewardQubeYardsBalance(caller, propertyListingReward);
  };

  // Get Properties by Transaction Type
  public query ({ caller }) func getPropertiesByTransactionType(transactionType : TransactionType) : async [Property] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated partners can view properties");
    };

    properties.values().toArray().filter(
      func(property) {
        property.transactionType == transactionType and property.status == #available;
      }
    );
  };

  // Get Properties by Project Stage
  public query ({ caller }) func getPropertiesByProjectStage(projectStage : ProjectStage) : async [Property] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated partners can view properties");
    };

    properties.values().toArray().filter(
      func(property) {
        property.projectStage == projectStage and property.status == #available;
      }
    );
  };

  // Approve Property (Admin Only)
  public shared ({ caller }) func approveProperty(propertyId : Nat) : async () {
    // Authorization check for admin only
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can approve properties");
    };

    switch (properties.get(propertyId)) {
      case (null) {
        Runtime.trap("Property not found");
      };
      case (?property) {
        if (property.status != #pendingApproval) {
          Runtime.trap("Property is not pending approval");
        };

        let updatedProperty : Property = {
          id = property.id;
          location = property.location;
          price = property.price;
          propertyType = property.propertyType;
          transactionType = property.transactionType;
          projectStage = property.projectStage;
          status = #available;
        };

        properties.add(propertyId, updatedProperty);
      };
    };
  };

  // Get All Approved Properties
  public query ({ caller }) func getProperties() : async [Property] {
    // Only authenticated users (partners) can view properties
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated partners can view properties");
    };

    properties.values().toArray().filter(
      func(property) {
        property.status == #available;
      }
    );
  };

  // Add Lead
  public shared ({ caller }) func addLead(customerName : Text) : async () {
    // Only authenticated users can add leads
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can add leads");
    };

    // Ensure only registered partners can add leads
    if (not partners.containsKey(caller)) {
      Runtime.trap("Unauthorized: Only registered partners can add leads");
    };

    // Get the current lead ID or default to 0
    var currentId = 0;
    if (leadIdCounter.size() > 0) {
      currentId := leadIdCounter.at(0);
    };

    let lead : Lead = {
      id = currentId;
      partnerPrincipal = caller;
      customerName;
      status = #new;
    };

    leads.add(currentId, lead);
    // Increment lead ID
    leadIdCounter := List.fromArray<Nat>([currentId + 1]);

    // Reward QubeYards currency for successful referral
    rewardQubeYardsBalance(caller, referralReward);
  };

  // Get Leads for Partner
  public query ({ caller }) func getLeads() : async [Lead] {
    // Only authenticated users can view their leads
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view leads");
    };

    leads.values().toArray().filter(
      func(lead) {
        lead.partnerPrincipal == caller;
      }
    );
  };

  // Add Commission (Admin Only)
  public shared ({ caller }) func addCommission(
    partnerPrincipal : Principal,
    amount : Nat,
    status : CommissionStatus,
  ) : async () {
    // Authorization check for admin only
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add commissions");
    };

    // Get the current commission ID or default to 0
    var currentId = 0;
    if (commissionIdCounter.size() > 0) {
      currentId := commissionIdCounter.at(0);
    };

    let commission : Commission = {
      id = currentId;
      partnerPrincipal;
      amount;
      status;
      paymentDate = null;
    };

    commissions.add(currentId, commission);
    // Increment commission ID
    commissionIdCounter := List.fromArray<Nat>([currentId + 1]);
  };

  // Get Commissions for Partner
  public query ({ caller }) func getCommissions() : async [Commission] {
    // Only authenticated users can view their commissions
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view commissions");
    };

    commissions.values().toArray().filter(
      func(commission) {
        commission.partnerPrincipal == caller;
      }
    );
  };

  // Mark Commission as Paid (Admin Only)
  public shared ({ caller }) func markCommissionPaid(commissionId : Nat, paymentDate : Int) : async () {
    // Authorization check for admin only
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can mark commissions as paid");
    };

    switch (commissions.get(commissionId)) {
      case (null) {
        Runtime.trap("Commission not found");
      };
      case (?commission) {
        let updatedCommission : Commission = {
          id = commission.id;
          partnerPrincipal = commission.partnerPrincipal;
          amount = commission.amount;
          status = #paid;
          paymentDate = ?paymentDate;
        };
        commissions.add(commissionId, updatedCommission);
      };
    };
  };

  // Get Partner Profile
  public query ({ caller }) func getPartnerProfile() : async ?Partner {
    // Only authenticated users can view their partner profile
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view partner profiles");
    };

    partners.get(caller);
  };

  // Get QubeYards Balance
  public query ({ caller }) func getQubeYardsBalance() : async Nat {
    // Only authenticated users can view their QubeYards balance
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view balance");
    };

    switch (qubeYardsUsers.get(caller)) {
      case (null) { 0 };
      case (?user) { user.balance };
    };
  };

  // Internal helper to reward QubeYards balance
  func rewardQubeYardsBalance(principal : Principal, amount : Nat) {
    let currentBalance = switch (qubeYardsUsers.get(principal)) {
      case (null) { 0 };
      case (?user) { user.balance };
    };

    let updatedUser : QubeYardsUser = {
      principal;
      balance = currentBalance + amount;
    };

    qubeYardsUsers.add(principal, updatedUser);
  };

  // New query to get property by id
  public query ({ caller }) func getProperty(id : Nat) : async ?Property {
    properties.get(id);
  };
};
