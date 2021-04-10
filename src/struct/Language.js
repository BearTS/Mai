module.exports = class Language{
  constructor(client, languages){

    /**
     * The client that instantiated this Manager
     * @name CommandManager#client
     * @type {MaiClient}
     * @readonly
     */
    Object.defineProperty(this, 'client', { value: client });

    this.store = languages;
  };

  get({ parameters, path, language }){
    const variables = new RegExp(Object.keys(parameters).join('|'),'g');
    const response = path.reduce((acc, cur) => acc[cur], this.store[language] || this.default);
    return response.replace(variables, x => parameters[x]);
  };

  getCommand(commandName, language){
    const responses = this.store[language || 'en-us'].commands[commandName];
    let get = ({ parameters, id}) => {
      const variables = new RegExp(Object.keys(parameters).join('|'),'g');
      const response = responses[id] || this.default.commands[commandName][id];
      return response.replace(variables, x => parameters[x]);
    };
    return { response: !!responses, get };
  };

  get default(){
    this.store['en-us'];
  };
};
