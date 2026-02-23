import List "mo:core/List";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import MixinAuthorization "authorization/MixinAuthorization";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";

actor {
  // Access Control
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Data Types
  public type UserProfile = {
    name : Text;
    companyName : Text;
    contactDetails : Text;
    licenseInfo : Text;
  };

  type Property = {
    id : Nat;
    location : Text;
    price : Nat;
    propertyType : Text;
    status : Text; // e.g., "available", "sold"
  };

  type Partner = {
    principal : Principal;
    name : Text;
    companyName : Text;
    contactDetails : Text;
    licenseInfo : Text;
  };

  type LeadStatus = {
    #new;
    #contacted;
    #inProgress;
    #closed;
  };

  type Lead = {
    id : Nat;
    partnerPrincipal : Principal;
    customerName : Text;
    status : LeadStatus;
  };

  type Commission = {
    id : Nat;
    partnerPrincipal : Principal;
    amount : Nat;
    status : Text; // "earned", "pending", "paid"
    paymentDate : ?Int;
  };

  // Persistent Storage using Maps
  let userProfiles = Map.empty<Principal, UserProfile>();
  let partners = Map.empty<Principal, Partner>();
  let properties = Map.empty<Nat, Property>();
  let leads = Map.empty<Nat, Lead>();
  let commissions = Map.empty<Nat, Commission>();

  // Counter arrays for persistent IDs
  var propertyIdCounter = List.fromArray<Nat>([0]);
  var leadIdCounter = List.fromArray<Nat>([0]);
  var commissionIdCounter = List.fromArray<Nat>([0]);

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
    status : Text,
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
      status;
    };

    properties.add(currentId, property);
    // Increment property ID
    propertyIdCounter := List.fromArray<Nat>([currentId + 1]);
  };

  // Get All Properties (Partners Only)
  public query ({ caller }) func getProperties() : async [Property] {
    // Only authenticated users (partners) can view properties
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated partners can view properties");
    };

    properties.values().toArray();
  };

  // Add Lead
  public shared ({ caller }) func addLead(customerName : Text) : async () {
    // Only authenticated users can add leads
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can add leads");
    };

    // Ensure only registered partners can add leads
    if (not (partners.containsKey(caller))) {
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
    status : Text,
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
          status = "paid";
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
};
