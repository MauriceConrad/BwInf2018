module.exports = class Member {
  constructor(memberProto, superTeeniGramGroupInstance) {
    // Name of this member
    this.name = memberProto.name;
    // Indexes of members, this member is following
    this.__following = memberProto.following;
    // Reference to super teenigram group instance (this member is constructed from)
    this.__superTeeniGramGroupInstance = superTeeniGramGroupInstance;

  }
  // Get the index of this member within its group
  get index() {
    return this.group.indexOf(this);
  }
  // Get the group this member is part of
  get group() {
    return this.__superTeeniGramGroupInstance.members;
  }
  get following() {
    // Just replace the '__following' array that contains indexes of members with the Member instance of the related members
    return this.__following.map(memberIndex => this.group[memberIndex]);
  }
  get followers() {
    // Filter all members of the group by checking wether they are following this member
    // The '__following' array of each member will be checked wether it includes this memmber's index
    return this.group.filter(member => member.__following.includes(this.index));
  }
};
