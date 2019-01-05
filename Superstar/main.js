const Member = require('./Member');

class TeeniGramGroup {
  constructor(group) {
    this.members = group.map((member, index) => new Member(member, this));

  }
  getSuperstar() {
    // List of members that can not be a superstar because of some reasons
    const disqualifiedMembers = [];

    var requestsCount = 0;

    // First of all, loop trough all members that are not following anyone because each of them is a potential superstar
    for (let member of this.members.filter(member => member.following.length == 0)) {
      // If the current member is not already disqualified, try it
      if (!disqualifiedMembers.includes(member)) {
        // Get wether the current member is the superstar
        const isSuperstar = (() => {
          // List of all potential followers the current member could have (All except itself)
          const potentialFollowers = this.members.filter(currMember => currMember != member);
          // Loop trough
          for (let potentialFollower of potentialFollowers) {
            // Get the fact wether the potential follower is following the current member
            const isFollowing = this.requestIsFollowing(potentialFollower, member);
            // Count the requests
            requestsCount++;
            // If the potential follower is following the current member, go on
            if (isFollowing) {
              // But this also disqualifies the potentail follower to be the superstar
              disqualifiedMembers.push(potentialFollower);
            }
            // If the potential follower is not following the current member:
            // Return false because we know that the current member can not be the superstar
            else {
              return false;
            }
          }
          // There was no member that is not following the current member, therefore it is the superstar
          return true;
        })();
        // If the current member is the superstar, return it as superstar
        if (isSuperstar) {
          return {
            superstar: member,
            requests: requestsCount
          };
        }
      }
    }
    // Return null because no superstar was detected
    return null;
  }
  // Method that returns wether a potential follower is following a specific member
  // This request costs 1 € per call
  requestIsFollowing(potentialFollower, member) {
    // Return wether the array of members the potential follower is following includes the requested member
    return potentialFollower.following.includes(member);
  }
};


module.exports = TeeniGramGroup;
