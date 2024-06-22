import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation, createPath } from "react-router-dom";
import * as api from "../../services/api.jsx";

import MenuLateral from "../../components/MenuLateral/MenuLateral.jsx";
import Campo from "../../components/Campo/Campo.jsx";
import MenuSuspenso from "../../components/MenuSuspenso/MenuSuspenso.jsx";
import Botao from "../../components/Botao/Botao.jsx";
import RadioBotao from "../../components/RadioBotao/RadioBotao.jsx";
import BotaoRadio from "../../components/BotaoRadio/BotaoRadio.jsx";

import { HiArrowDownTray } from "react-icons/hi2";
import { HiArrowPathRoundedSquare } from "react-icons/hi2";
import { HiOutlineTrash } from "react-icons/hi2";
import { HiOutlinePencilSquare } from "react-icons/hi2";

import "./TelaCadastro.css";

const TelaCadastro = () => {
	const [afastamento, setAfastamento] = useState(false);
	const location = useLocation();
	const funcionario = location.state?.funcionario;
	const navegar = useNavigate();
	const {
		register,
		setValue,
		reset,
		handleSubmit,
		trigger,
		watch,
		formState: { errors },
	} = useForm();

	const porteArmaValor = watch("porteArma", true);
	const sexoValor = watch("sexo", 'M');
	const tipoSanguineoValor = watch("tipoSanguineo", 'AB+');
	const estadoCivilValor = watch("estadoCivil", 'Solteiro(a)');
	const cnhCategoriaValor = watch("cnhCategoria", 'A');
	const escalaValor = watch("escala", '8 x 40');
	const motivoValor = watch("motivo", 'Abono');
	const observacoes = watch("observacoes", '');

	useEffect(() => {
		if (funcionario) {
			reset({
				
				//cadastro geral
				matricula: funcionario.matricula,
				nomeGuerra: funcionario.nomeGuerra,
				nomeCompleto: funcionario.nomeCompleto,
				sexo: funcionario.sexo,
				dataDeNascimento: funcionario.dataDeNascimento ? new Date(funcionario.dataDeNascimento).toISOString().split('T')[0] : '',
				tipoSanguineo: funcionario.tipoSanguineo,
				nomeMae: funcionario.nomeMae,
				nomePai: funcionario.nomePai,
				email: funcionario.email,
				telefone: funcionario.telefone,
				postGrad: funcionario.postGrad,
				escolaridade: funcionario.escolaridade,
				estadoCivil: funcionario.estadoCivil,

				//documentacao
				rg: funcionario.rg,
				cpf: funcionario.cpf,
				matSiape: funcionario.matSiape,
				cnhCategoria: funcionario.cnhCategoria,
				cnhValidade: funcionario.cnhValidade ? new Date(funcionario.cnhValidade).toISOString().split('T')[0] : '',
				cnhProntuario: funcionario.cnhProntuario,

				//endereco
				cep: funcionario.cep,
				cidade: funcionario.cidade,
				bairro: funcionario.bairro,
				uf: funcionario.uf,
				logradouro: funcionario.logradouro,

				//ficha gerencial
				classificacao: funcionario.classificacao,
				funcao: funcionario.funcao,
				escala: funcionario.escala,
				horarioEscala: funcionario.horarioEscala,
				lotacao: funcionario.lotacao,
				comportamento: funcionario.comportamento,
				porteArma: funcionario.porteArma,
				apresentacao: funcionario.apresentacao ? new Date(funcionario.apresentacao).toISOString().split('T')[0] : '',
				admissao: funcionario.admissao ? new Date(funcionario.admissao).toISOString().split('T')[0] : '',
				validadeBienal: funcionario.validadeBienal ? new Date(funcionario.validadeBienal).toISOString().split('T')[0] : '',
				validadeTAF: funcionario.validadeTAF ? new Date(funcionario.validadeTAF).toISOString().split('T')[0] : '',

				//afastamento
				motivo: funcionario.motivo,
				anoReferencia: funcionario.anoReferencia,
				dataInicio: funcionario.dataInicio ? new Date(funcionario.dataInicio).toISOString().split('T')[0] : '',
				dataTermino: funcionario.dataTermino ? new Date(funcionario.dataTermino).toISOString().split('T')[0] : '',
				dias: funcionario.dias,
				observacoes: funcionario.observacoes,
			})
		}
	}, [funcionario, reset, setValue]);

	const aoEnviar = async (dadosDoFormulario) => {
		try {
			if (funcionario)
				await api.editarUsuario(funcionario._id, dadosDoFormulario);

			else
				await api.cadastrarUsuario(dadosDoFormulario);
			navegar("/inicial");
		} catch (error) {
			throw new Error(error);
		}
	};

	const excluirUsuario = async (data) => {
		try {
			await api.excluirUsuario(data._id);
			navegar("/inicial");
		} catch (error) {
			throw new Error("Erro ao excluir usuário");
		}
	}

	const botaoMudanca = async () => {
		const camposPreenchidos = await trigger(["matricula", "nomeCompleto"]);
		if (camposPreenchidos) setAfastamento(!afastamento);
	};

	return (
		<div className="cadastro">
			<MenuLateral />

			<div className="conteudo-principal">
				<div className="linha-horizontal">
					<div className="classe-botao">
						<button type="button" className={`botao-dados ${afastamento ? "" : "selecionado"}`} onClick={botaoMudanca}>
							Dados pessoais
						</button>
						<button
							type="button"
							className={`botao-afastamento ${afastamento ? "selecionado" : ""}`}
							onClick={botaoMudanca}
						>
							Afastamento
						</button>
					</div>
					<hr />
				</div>
				<div className="conteiner">
					<div className={`dados-pessoais ${afastamento ? "modoLeitor" : ""}`}>
						<h3>Cadastro Geral</h3>
						<form className="formulario-cadastro" onSubmit={handleSubmit(aoEnviar)}>
							<fieldset id="secao1">
								<legend>Dados pessoais</legend>
								<div className="linha">
									<Campo
										id="matricula"
										texto="Matrícula"
										tipo="text"
										registro={afastamento ? undefined : register}
										erros={errors}
										opcoes={{
											required: "*Campo obrigatório",
										}}
									/>
									<Campo id="nomeGuerra" texto="Nome de Guerra" tipo="text" registro={register} erros={errors} />
								</div>
								<Campo
									id="nomeCompleto"
									texto="Nome Completo"
									tipo="text"
									registro={afastamento ? undefined : register}
									erros={errors}
									opcoes={{
										required: "*Campo obrigatório",
										pattern: { value: /^[A-Za-z\u00C0-\u00FF\s]+$/, message: "*Somente letras" },
									}}
								/>
								<div className="linha">
									<MenuSuspenso 
									id="sexo" 
									texto="Sexo" 
									opcoes={["M", "F"]} 
									largura="40px" 
									value={sexoValor} 
									onChange={(value) => setValue("sexo", value)} /> 
						
									<Campo id="dataDeNascimento" texto="Nascimento" tipo="date" registro={register} erros={errors} />
									<MenuSuspenso
										id="tipoSanguineo"
										texto="Tipo Sanguíneo"
										largura="100%"
										opcoes={["AB+", "AB-", "A+", "A-", "B+", "B-", "O+", "O-"]}
										value={tipoSanguineoValor} 
										onChange={(value) => setValue("tipoSanguineo", value)}
									/>
								</div>
							</fieldset>
							<fieldset id="secao2">
								<legend>Informações Familiares</legend>
								<Campo id="nomeMae" texto="Nome da Mãe" tipo="text" registro={register} erros={errors} />
								<Campo id="nomePai" texto="Nome do Pai" tipo="text" registro={register} erros={errors} />
								<div className="linha">
									<Campo id="email" texto="Email" tipo="email" registro={register} erros={errors} />
									<Campo
										id="telefone"
										texto="Telefone"
										tipo="text"
										registro={register}
										erros={errors}
										opcoes={{ pattern: { value: /[0-9]{11}$/, message: "*Somente números" } }}
									/>
								</div>
							</fieldset>
							<fieldset id="secao3">
								<legend>Informações Profissionais</legend>
								<Campo id="postGrad" texto="Post/Grad." tipo="text" registro={register} erros={errors} />
								<Campo id="escolaridade" texto="Escolaridade" tipo="text" registro={register} erros={errors} />
								<MenuSuspenso
									id="estadoCivil"
									texto="Estado Civil"
									opcoes={["Solteiro(a)", "Casado(a)", "Divorciado(a)", "Viúvo(a)"]}
									largura="100%"
									value={estadoCivilValor} 
									onChange={(value) => setValue("estadoCivil", value)}
								/>
							</fieldset>
						</form>
					</div>

					{!afastamento && (
						<div className="bloco-central">
							<div className="documentacao">
								<h3>Documentação</h3>
								<form className="formulario-documentacao" onSubmit={handleSubmit(aoEnviar)}>
									<fieldset id="secao4">
										<legend>Documentos pessoais</legend>
										<div className="linha">
											<Campo
												id="rg"
												texto="RG"
												tipo="text"
												registro={register}
												erros={errors}
												opcoes={{ pattern: { value: /^[0-9]*$/, message: "*Somente números" } }}
											/>
											<Campo
												id="cpf"
												texto="CPF"
												tipo="text"
												registro={register}
												erros={errors}
												opcoes={{ pattern: { value: /^[0-9]*$/, message: "*Somente números" } }}
											/>
											<Campo
												id="matSiape"
												texto="Mat Siape"
												tipo="text"
												registro={register}
												erros={errors}
												opcoes={{ pattern: { value: /^[0-9]*$/, message: "*Somente números" } }}
											/>
										</div>
										<div className="linha">
											<MenuSuspenso
												id="cnhCategoria"
												texto="CNH Categoria"
												largura="100%"
												opcoes={["A", "AB", "AC", "AD", "AE", "B", "C", "D", "E"]}
												value={cnhCategoriaValor} 
												onChange={(value) => setValue("cnhCategoria", value)}
											/>
											<Campo id="cnhValidade" texto="CNH Validade" tipo="date" registro={register} erros={errors} />
											<Campo
												id="cnhProntuario"
												texto="CNH Prontuário"
												tipo="text"
												registro={register}
												erros={errors}
												opcoes={{ pattern: { value: /^[0-9]*$/, message: "*Somente números" } }}
											/>
										</div>
									</fieldset>
								</form>
							</div>
							<div className="endereco">
								<h3>Endereço</h3>
								<form className="formulario-endereco" onSubmit={handleSubmit(aoEnviar)}>
									<fieldset id="secao5">
										<legend>Informações de Endereço</legend>
										<div className="linha">
											<Campo
												id="cep"
												texto="CEP"
												tipo="text"
												registro={register}
												erros={errors}
												opcoes={{ pattern: { value: /^[0-9]*$/, message: "*Somente números" } }}
											/>
											<Campo id="cidade" texto="Cidade" tipo="text" registro={register} erros={errors} />
											<Campo id="bairro" texto="Bairro" tipo="text" registro={register} erros={errors} />
											<Campo
												id="uf"
												texto="UF"
												tipo="text"
												registro={register}
												erros={errors}
												opcoes={{ pattern: { value: /^[A-Z]{2}$/, message: "Ex: DF" } }}
											/>
										</div>
										<Campo id="logradouro" texto="Logradouro" tipo="text" registro={register} erros={errors} />
									</fieldset>
								</form>
							</div>
						</div>
					)}

					{!afastamento && (
						<div className="ficha-gerencial">
							<h3>Ficha Gerencial</h3>
							<form className="formulario-ficha-gerencial" onSubmit={handleSubmit(aoEnviar)}>
								<fieldset id="secao6">
									<legend>Informações Gerenciais</legend>
									<div className="linha">
										<Campo id="classificacao" texto="Classificação" tipo="text" registro={register} erros={errors} />
										<Campo id="funcao" texto="Função" tipo="text" registro={register} erros={errors} />
										<MenuSuspenso
											id="escala"
											texto="Escala"
											largura="125px"
											opcoes={["8 x 40", "12 x 36", "12 x 60", "24 x 72", "Expediente"]}
											value={escalaValor} 
											onChange={(value) => setValue("escala", value)}
										/>
										<Campo id="horarioEscala" texto="Horário" tipo="text" registro={register} erros={errors} />
										<Campo id="lotacao" texto="Lotação" tipo="text" registro={register} erros={errors} />
									</div>
									<div className="linha">
										<Campo id="comportamento" texto="Comportamento" tipo="text" registro={register} erros={errors} />
										<BotaoRadio
											id="porteArma"
											value={porteArmaValor}
											onChange={(value) => setValue("porteArma", value)}
											opcao1={"Sim"}
											opcao2={"Não"}
											nome={"Porte de Arma"}
										/>
										<Campo id="apresentacao" texto="Apresentação" tipo="date" registro={register} erros={errors} />
										<Campo id="admissao" texto="Admissão" tipo="date" registro={register} erros={errors} />
										<Campo id="validadeBienal" texto="Validade Bienal" tipo="date" registro={register} erros={errors} />
										<Campo id="validadeTAF" texto="Validade TAF" tipo="date" registro={register} erros={errors} />
									</div>
								</fieldset>
							</form>
						</div>
					)}

					{afastamento && (
						<div className="afastamento">
							<h3>Afastamento</h3>
							<form className="formulario-afastamento">
								<section>
									<div className="linha">
										<MenuSuspenso
											id="motivo"
											texto="Motivo"
											largura="190px"
											opcoes={[
												"Abono",
												"LTSP",
												"Férias",
												"LTIP",
												"LTSPF",
												"Núpcias",
												"Licença Paternidade",
												"Dispensa Recompensa",
												" Restrição Médica",
												"Recesso Final de Ano",
												"Atestado de Comparecimento",
												"Atestado de Acompanhamento",
												"Outros",
											]}
											value={motivoValor} 
											onChange={(value) => setValue("motivo", value)}
										/>
										<Campo id="anoReferencia" texto="Ano Referência" tipo="text" registro={register} erros={errors} />
										<Campo id="dataInicio" texto="Data Início" tipo="date" registro={register} erros={errors} />
										<Campo id="dataTermino" texto="Data Término" tipo="date" registro={register} erros={errors} />
										<Campo id="dias" texto="Dias" tipo="text" registro={register} erros={errors} />
									</div>
									<div className="conteiner-observacao">
									<span>Observações</span>
									<p>*opcional</p>
									</div>
									<textarea
									name="Observacao" 
									id="observacoes" 
									value={observacoes} 
									onChange={(value) => setValue("observacoes", event.target.value)} />
								</section>
							</form>
						</div>
					)}
				</div>
				<div className="botoes">
					{funcionario && (
						<p id="ultimoEditor">{`Editado por ${funcionario.ultimoEditor}`}</p>
					)}

					<Botao
						id="voltar"
						icone={<HiArrowPathRoundedSquare size={20} style={{ marginRight: "5px" }} />}
						texto="Voltar"
						cor="#032026"
						largura={"130px"}
						aoClicar={(e) => { navegar("/inicial") }}
					/>

					{funcionario && (

						<Botao
							id="excluir"
							icone={<HiOutlineTrash size={20} style={{ marginRight: "5px" }} />}
							texto="Excluir"
							cor="#8C1C45"
							largura={"130px"}
							aoClicar={(e) => {
								e.preventDefault();
								excluirUsuario(funcionario);
							}}
						/>
					)}

					{funcionario && (
						<Botao
							id="atualizar"
							icone={<HiOutlinePencilSquare size={20} style={{ marginRight: "5px" }} />}
							texto="Atualizar"
							cor="#F29B30"
							largura={"130px"}
							aoClicar={(e) => {
								e.preventDefault();
								handleSubmit(aoEnviar)();
							}}
						/>
					)}


					{!funcionario && (
						<Botao
							id="salvar"
							icone={<HiArrowDownTray size={20} style={{ marginRight: "5px" }} />}
							texto="Salvar"
							cor="#588C7E"
							largura={"130px"}
							aoClicar={(e) => {
								e.preventDefault();
								handleSubmit(aoEnviar)();
							}}
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default TelaCadastro;