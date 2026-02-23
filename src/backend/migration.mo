import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";

module {
  type OldProperty = {
    id : Nat;
    location : Text;
    price : Nat;
    propertyType : Text;
    status : Text;
  };

  type OldCommission = {
    id : Nat;
    partnerPrincipal : Principal;
    amount : Nat;
    status : Text;
    paymentDate : ?Int;
  };

  type OldActor = {
    userProfiles : Map.Map<Principal, {
      name : Text;
      companyName : Text;
      contactDetails : Text;
      licenseInfo : Text;
    }>;
    partners : Map.Map<Principal, {
      principal : Principal;
      name : Text;
      companyName : Text;
      contactDetails : Text;
      licenseInfo : Text;
    }>;
    properties : Map.Map<Nat, OldProperty>;
    leads : Map.Map<Nat, {
      id : Nat;
      partnerPrincipal : Principal;
      customerName : Text;
      status : {
        #new;
        #contacted;
        #inProgress;
        #closed;
      };
    }>;
    commissions : Map.Map<Nat, OldCommission>;
    propertyIdCounter : List.List<Nat>;
    leadIdCounter : List.List<Nat>;
    commissionIdCounter : List.List<Nat>;
  };

  type NewActor = {
    userProfiles : Map.Map<Principal, {
      name : Text;
      companyName : Text;
      contactDetails : Text;
      licenseInfo : Text;
    }>;
    partners : Map.Map<Principal, {
      principal : Principal;
      name : Text;
      companyName : Text;
      contactDetails : Text;
      licenseInfo : Text;
    }>;
    properties : Map.Map<Nat, {
      id : Nat;
      location : Text;
      price : Nat;
      propertyType : Text;
      transactionType : {
        #buy;
        #sell;
        #rent;
      };
      projectStage : {
        #preLaunch;
        #launch;
        #readyToShift;
      };
      status : {
        #available;
        #sold;
        #rented;
        #pendingApproval;
      };
    }>;
    leads : Map.Map<Nat, {
      id : Nat;
      partnerPrincipal : Principal;
      customerName : Text;
      status : {
        #new;
        #contacted;
        #inProgress;
        #closed;
      };
    }>;
    commissions : Map.Map<Nat, {
      id : Nat;
      partnerPrincipal : Principal;
      amount : Nat;
      status : {
        #earned;
        #pending;
        #paid;
      };
      paymentDate : ?Int;
    }>;
    propertyIdCounter : List.List<Nat>;
    leadIdCounter : List.List<Nat>;
    commissionIdCounter : List.List<Nat>;
    qubeYardsUsers : Map.Map<Principal, {
      principal : Principal;
      balance : Nat;
    }>;
  };

  func convertOldCommission(oldCommission : OldCommission) : {
    id : Nat;
    partnerPrincipal : Principal;
    amount : Nat;
    status : { #earned; #pending; #paid };
    paymentDate : ?Int;
  } {
    {
      id = oldCommission.id;
      partnerPrincipal = oldCommission.partnerPrincipal;
      amount = oldCommission.amount;
      status = switch (oldCommission.status) {
        case ("earned") { #earned };
        case ("pending") { #pending };
        case ("paid") { #paid };
        case (_) { #pending };
      };
      paymentDate = oldCommission.paymentDate;
    };
  };

  public func run(old : OldActor) : NewActor {
    let newProperties = old.properties.map<Nat, OldProperty, {
      id : Nat;
      location : Text;
      price : Nat;
      propertyType : Text;
      transactionType : {
        #buy;
        #sell;
        #rent;
      };
      projectStage : {
        #preLaunch;
        #launch;
        #readyToShift;
      };
      status : {
        #available;
        #sold;
        #rented;
        #pendingApproval;
      };
    }>(
      func(_id, oldProperty) {
        {
          id = oldProperty.id;
          location = oldProperty.location;
          price = oldProperty.price;
          propertyType = oldProperty.propertyType;
          transactionType = #buy;
          projectStage = #launch;
          status = switch (oldProperty.status) {
            case ("available") { #available };
            case ("sold") { #sold };
            case (_) { #pendingApproval };
          };
        };
      }
    );

    let newCommissions = old.commissions.map<Nat, OldCommission, {
      id : Nat;
      partnerPrincipal : Principal;
      amount : Nat;
      status : {
        #earned;
        #pending;
        #paid;
      };
      paymentDate : ?Int;
    }>(
      func(_id, oldCommission) {
        convertOldCommission(oldCommission);
      }
    );

    {
      userProfiles = old.userProfiles;
      partners = old.partners;
      properties = newProperties;
      leads = old.leads;
      commissions = newCommissions;
      propertyIdCounter = old.propertyIdCounter;
      leadIdCounter = old.leadIdCounter;
      commissionIdCounter = old.commissionIdCounter;
      qubeYardsUsers = Map.empty<Principal, {
        principal : Principal;
        balance : Nat;
      }>();
    };
  };
};
