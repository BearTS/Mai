class LanguageSelector{
  constructor(command, language, Language){

    this.default = Language.store['en-us'].commands[command];
    this.responses = Language.store[language || 'en-us']?.commands[command];
  };

  get({ parameters, id}){
    const variables = parameters ? new RegExp(Object.keys(parameters).join('|'), 'g') : null;
    const response = this.responses?.[id] || this.default?.[id] || '\\❌ Error on parse-language: ID_NOT_FOUND';
    return variables ? response.replace(variables, x => parameters[x]) : response;
  };
};

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

    this.defaultLanguage = 'en-us';
  };

  get({ parameters, path, language }){
    const variables = parameters ? new RegExp(Object.keys(parameters).join('|'),'g') : null;
    const response = path.reduce((acc, cur) => acc?.[cur], this.store[language] || this.default) || path.reduce((acc, cur) => acc[cur], this.default);
    return variables ? response.replace(variables, x => parameters[x]) : response;
  };

  getCommand(commandName, language){
    return new LanguageSelector(commandName, language, this);
  };

  get default(){
    this.store[this.defaultLanguage];
  };
};
