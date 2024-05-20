import ChistaModule     from 'chista';
import * as chistaUtils from './utils/chistaUtils.mjs';

const chista = new ChistaModule.default({});

chista.makeUseCaseRunner = chistaUtils.makeUseCaseRunner;
chista.runUseCase = chistaUtils.runUseCase;

export default chista;
