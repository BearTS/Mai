class LanguageSelector{
  constructor(command, language, Language){

    this.default = {};
    this.responses = {};
    this.Parameter = class Parameter{
      constructor(object = {}){
        if (typeof object !== 'object' || Array.isArray(object)){
          throw new Error(`Parameter: Expected object, received ${typeof object} on constructor.`);
        } else {
          this.assign(object);
        };
      };

      assign(object = {}){
        if (typeof object !== 'object' || Array.isArray(object)){
          throw new Error(`Parameter#assign: Expected object, received ${typeof object}.`);
        } else {
          for (const [prop, val] of Object.entries(object)){
            this[prop] = val;
          };
        };
        return this;
      };
    };

    for (const [type, lang] of [['default', 'en-us'], ['responses', language]]){
      for (const prop of ['COMMANDS', 'ERRORS', 'DICTIONARIES']){
        if (prop === 'COMMANDS'){
          this[type][prop] = Object.fromEntries(
            Object.entries(Language.store[lang]?.[prop]||{}).
            filter(([k,v]) => k.startsWith('__') || k.startsWith(command.toUpperCase()))
          );
        } else {
          this[type][prop] = Language.store[lang]?.[prop] || {};
        };
      };
    };
  };

  get(options){
    if (typeof options !== 'object' || Array.isArray(options)){
      throw new Error('LanguageSelector#get: options is required.');
    };

    for (const prop of ['$in', 'id']){
      if (typeof options[prop] === 'undefined'){
        throw new Error(`LanguageSelector#get: options['${prop}'] is required.`);
      } else if (!['string', 'number'].includes(typeof options[prop])){
        throw new Error(`LanguageSelector#get: options['${prop}'] expected string, received ${typeof options[prop]}`);
      };
    };

    const variables = options.parameters ? new RegExp(Object.keys(options.parameters).join('|'), 'g') : null;
    const response = this.responses[options['$in']]?.[options.id] || this.default[options['$in']]?.[options.id] || `❌ Error on parse-language: '$in' or 'ID' Not found.`;
    return variables ? response.replace(variables, x => options.parameters[x]) : response;
  };

  getDictionary(list){
    const res = {};
    for (const item of list){
      res[item.toUpperCase()] = this.responses.DICTIONARIES[item.toUpperCase()] || this.default.DICTIONARIES[item.toUpperCase()];
    };
    return res;
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
